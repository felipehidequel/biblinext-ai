import { db } from './firebase';
import { collection, getDocs, query, where, getDoc, doc, limit } from 'firebase/firestore';
import type { User, Book, LoanRequest } from './types';
import { unstable_noStore as noStore } from 'next/cache';

// Importa os módulos para ler arquivos
import fs from 'fs/promises';
import path from 'path';

// Define o caminho para o arquivo de fallback
const fallbackFilePath = path.join(process.cwd(), 'firestore-fallback.json');

// --- FUNÇÃO DE BUSCAR LIVROS ATUALIZADA ---
export async function getBooks() {
  // Impede o cache estático para garantir que os dados sejam sempre frescos
  noStore();
  
  let firestoreBooks: Book[] = [];
  let fallbackBooks: Book[] = [];

  // 1. Tenta buscar os livros do Firestore
  try {
    const q = query(collection(db, "books"));
    const querySnapshot = await getDocs(q);
    firestoreBooks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Book[];
    console.log('Livros carregados do Firestore com sucesso.');
  } catch (error) {
    console.error('Falha ao buscar livros do Firestore:', error);
    console.log('A listagem de livros dependerá apenas do arquivo de fallback.');
  }

  // 2. Tenta buscar os livros do arquivo de fallback JSON
  try {
    // Lê o conteúdo do arquivo
    const fileContent = await fs.readFile(fallbackFilePath, 'utf8');
    const fallbackData = JSON.parse(fileContent);
    
    // Filtra apenas os registros do tipo 'new_book' e mapeia para o formato de Book
    fallbackBooks = fallbackData
      .filter((entry: any) => entry.type === 'new_book')
      .map((entry: any, index: number) => ({
        id: `fallback-${index}`, // Cria um ID temporário para o item
        ...entry.data,
        isFromFallback: true, // Adiciona uma flag para indicar a origem
      }));
    console.log(`Carregados ${fallbackBooks.length} livro(s) do arquivo de fallback.`);
  } catch (error) {
    // Se o arquivo não existir ou der erro na leitura, apenas informa e continua.
    console.log('Nenhum arquivo de fallback encontrado ou arquivo está vazio.');
  }

  // 3. Junta as duas listas e retorna
  return [...firestoreBooks, ...fallbackBooks];
}


// --- RESTANTE DO ARQUIVO (sem alterações) ---

// Simula a obtenção do usuário logado (em um app real, viria de uma sessão)
export async function getCurrentUser(): Promise<User | null> {
  noStore();
  try {
    // Por enquanto, vamos fixar um usuário admin para testes
    // Substitua 'SEU_USER_ID_DE_ADMIN' pelo ID do seu usuário no Firestore
    const userRef = doc(db, 'users', '8xHe76P3mS9uS8E1a2b3'); 
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Falha ao buscar usuário atual do Firestore:", error);
    return null; // Retorna nulo se houver falha na comunicação
  }
}

export async function getPendingRequests() {
  noStore();
  const q = query(collection(db, "requests"), where("status", "==", "Pendente"));

  const querySnapshot = await getDocs(q);
  const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
  })) as LoanRequest[];

  const requestsWithDetails = await Promise.all(
      requests.map(async (request) => {
          const [user, book] = await Promise.all([
              getUserById(request.userId),
              getBookById(request.bookId),
          ]);
          return { ...request, user, book };
      })
  );

  return requestsWithDetails;
}

export async function getBookById(id: string): Promise<Book | null> {
    noStore();
    const docRef = doc(db, 'books', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Book : null;
}

export async function getUserById(id: string): Promise<User | null> {
    noStore();
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null;
}