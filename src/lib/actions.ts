
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
    throw new Error('Unauthorized');
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
      throw new Error('Unauthorized');
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
        throw new Error('Book not found');
    }
}


export async function approveRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const adminUser = await getCurrentUser();

  if (!adminUser || adminUser.role !== 'admin') {
     throw new Error('Unauthorized');
  }

  const requestRef = doc(db, 'requests', requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
      throw new Error('Request not found.');
  }

  const request = requestSnap.data() as Omit<LoanRequest, 'id'>;

  if (request.status !== 'Pending') {
    throw new Error('Request has already been processed.');
  }

  const [book, user] = await Promise.all([
    getBookById(request.bookId),
    getUserById(request.userId),
  ]);

  if (!book || !user) {
      throw new Error('Book or User not found.');
  }
  
  if (user.status === 'irregular') {
      await updateDoc(requestRef, { status: 'Rejected' });
      revalidatePath('/admin');
      throw new Error(`User is irregular. Request has been rejected.`);
  }

  if (!book.isAvailable) {
    await updateDoc(requestRef, { status: 'Rejected' });
    revalidatePath('/admin');
    throw new Error('Book is no longer available. Request has been rejected.');
  }

  const batch = writeBatch(db);

  // 1. Update request status to Approved
  batch.update(requestRef, { status: 'Approved' });
  
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
  return { success: true, message: 'Request approved and loan created.' };
}

export async function rejectRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const adminUser = await getCurrentUser();

  if (!adminUser || adminUser.role !== 'admin') {
     throw new Error('Unauthorized');
  }

  const requestRef = doc(db, 'requests', requestId);
  await updateDoc(requestRef, { status: 'Rejected' });

  revalidatePath('/admin');
  return { success: true, message: 'Request rejected.' };
}
