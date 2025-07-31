'use server';

import { revalidatePath } from 'next/cache';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { getCurrentUser, getUserById, getBookById } from './data';
import type { Book, LoanRequest } from './types';
import { addDays } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

// Define o caminho para o nosso arquivo de fallback
const fallbackFilePath = path.join(process.cwd(), 'firestore-fallback.json');

// Função auxiliar para garantir que o arquivo de fallback exista
async function ensureFallbackFile() {
  try {
    await fs.access(fallbackFilePath);
  } catch {
    await fs.writeFile(fallbackFilePath, JSON.stringify([]), 'utf8');
  }
}

// Função para adicionar um registro ao arquivo de fallback
async function writeToFallback(record: any) {
  await ensureFallbackFile();
  const fileContent = await fs.readFile(fallbackFilePath, 'utf8');
  const data = JSON.parse(fileContent);
  data.push({ ...record, failedAt: new Date().toISOString() });
  await fs.writeFile(fallbackFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function createBook(formData: FormData) {
  // Extrai os dados do formulário imediatamente
  const newBookData = {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    genre: formData.get('genre') as string,
    coverImage: formData.get('coverImage') as string,
    isAvailable: true,
  };

  try {
    // --- Início do Bloco de Ação Primária ---
    // 1. Tenta autenticar o usuário como admin PRIMEIRO.
    const user = await getCurrentUser();
    if (user?.role !== 'admin') {
      // Se não for admin, lança um erro que será pego pelo catch,
      // mas podemos dar uma mensagem específica.
      throw new Error('Ação permitida apenas para administradores.');
    }

    // 2. Se a autenticação passar, tenta salvar no Firestore.
    await addDoc(collection(db, 'books'), newBookData);
    console.log('Livro salvo no Firestore com sucesso!');
    // --- Fim do Bloco de Ação Primária ---

  } catch (error) {
    // --- Início do Bloco de Fallback ---
    // Qualquer erro no 'try' (autenticação ou Firestore) nos traz aqui.
    console.error('Falha na operação primária:', error);
    console.log('Acionando fallback: salvando em arquivo JSON local...');

    try {
      // Salva os dados extraídos do formulário, SEM NENHUMA VERIFICAÇÃO.
      await writeToFallback({ type: 'new_book', data: newBookData });
      console.log('Dados do livro salvos com segurança em firestore-fallback.json');
      
      // Retorna uma mensagem clara para a interface sobre o que aconteceu.
      return { success: true, fallback: true, message: 'Operação primária falhou. Dados foram salvos localmente.' };
    } catch (fallbackError) {
      console.error('CRÍTICO: Falha ao salvar no arquivo de fallback:', fallbackError);
      // Se até o fallback falhar, relançamos o erro original.
      throw error;
    }
    // --- Fim do Bloco de Fallback ---
  }

  // Só revalida o path se a operação principal (Firestore) teve sucesso.
  revalidatePath('/admin/books');
}

// ... (o restante do seu arquivo 'actions.ts' permanece o mesmo)
export async function updateBook(bookId: string, formData: FormData) {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') {
      throw new Error('Não autorizado');
    }

    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
       await updateDoc(bookRef, {
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        genre: formData.get('genre') as string,
        coverImage: formData.get('coverImage') as string,
      });
      revalidatePath('/admin/books');
      revalidatePath(`/admin/books/${bookId}/edit`);
    } else {
        throw new Error('Livro não encontrado');
    }
}


export async function approveRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const adminUser = await getCurrentUser();

  if (!adminUser || adminUser.role !== 'admin') {
     throw new Error('Não autorizado');
  }

  const requestRef = doc(db, 'requests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
      throw new Error('Solicitação não encontrada.');
  }

  const request = requestSnap.data() as Omit<LoanRequest, 'id'>;

  if (request.status !== 'Pendente') {
    throw new Error('A solicitação já foi processada.');
  }

  const [book, user] = await Promise.all([
    getBookById(request.bookId),
    getUserById(request.userId),
  ]);

  if (!book || !user) {
      throw new Error('Livro ou Usuário não encontrado.');
  }

  if (user.status === 'irregular') {
      await updateDoc(requestRef, { status: 'Rejeitado' });
      revalidatePath('/admin');
      throw new Error(`Usuário está irregular. A solicitação foi rejeitada.`);
  }

  if (!book.isAvailable) {
    await updateDoc(requestRef, { status: 'Rejeitado' });
    revalidatePath('/admin');
    throw new Error('O livro não está mais disponível. A solicitação foi rejeitada.');
  }

  const batch = writeBatch(db);

  // 1. Update request status to Approved
  batch.update(requestRef, { status: 'Aprovado' });

  // 2. Set book to unavailable
  const bookRef = doc(db, 'books', book.id);
  batch.update(bookRef, { isAvailable: false });

  // 3. Create a new loan
  const loanRef = doc(collection(db, 'loans'));
  const newLoan = {
    bookId: book.id,
    userId: user.id,
    borrowedDate: new Date().toISOString(),
    dueDate: addDays(new Date(), 14).toISOString(),
  };
  batch.set(loanRef, newLoan);

  await batch.commit();

  revalidatePath('/admin');
  revalidatePath('/admin/books');
  return { success: true, message: 'Solicitação aprovada e empréstimo criado.' };
}

export async function rejectRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const adminUser = await getCurrentUser();

  if (!adminUser || adminUser.role !== 'admin') {
     throw new Error('Não autorizado');
  }

  const requestRef = doc(db, 'requests', requestId);
  await updateDoc(requestRef, { status: 'Rejeitado' });

  revalidatePath('/admin');
  return { success: true, message: 'Solicitação rejeitada.' };
}