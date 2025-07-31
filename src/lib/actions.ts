
'use server';

import { revalidatePath } from 'next/cache';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { getCurrentUser, getUserById, getBookById } from './data';
import type { Book, LoanRequest, User } from './types';
import { addDays } from 'date-fns';

export async function createBook(formData: FormData) {
  const user = await getCurrentUser();
  if (user?.role !== 'admin') {
    throw new Error('Não autorizado');
  }

  const newBookData = {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    genre: formData.get('genre') as string,
    coverImage: formData.get('coverImage') as string,
    isAvailable: true,
  };

  await addDoc(collection(db, 'books'), newBookData);
  revalidatePath('/admin/books');
}

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
