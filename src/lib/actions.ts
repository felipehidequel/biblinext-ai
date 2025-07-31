'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { books, requests, users, loans } from './data';
import type { LoanRequest, Book } from './types';
import { addDays } from 'date-fns';

export async function createBook(formData: FormData) {
  const user = users[0];
  if (user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const newBook: Book = {
    id: `book-${Date.now()}`,
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    genre: formData.get('genre') as string,
    coverImage: formData.get('coverImage') as string,
    isAvailable: true,
  };

  books.push(newBook);
  revalidatePath('/admin/books');
}

export async function updateBook(bookId: string, formData: FormData) {
    const user = users[0];
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
  
    const bookIndex = books.findIndex((b) => b.id === bookId);
  
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        title: formData.get('title') as string,
        author: formData.get('author') as string,
        genre: formData.get('genre') as string,
        coverImage: formData.get('coverImage') as string,
      };
      revalidatePath('/admin/books');
      revalidatePath(`/admin/books/${bookId}/edit`);
    } else {
        throw new Error('Book not found');
    }
}


export async function approveRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const requestIndex = requests.findIndex((r) => r.id === requestId);
  const user = users[0];

  if (requestIndex === -1 || user?.role !== 'admin') {
     throw new Error('Failed to approve request. Request not found or unauthorized.');
  }

  const request = requests[requestIndex];

  if (request.status !== 'Pending') {
    throw new Error('Request has already been processed.');
  }
  
  const bookIndex = books.findIndex((b) => b.id === request.book.id);
  if (bookIndex === -1 || !books[bookIndex].isAvailable) {
    requests[requestIndex].status = 'Rejected';
    revalidatePath('/admin');
    throw new Error('Book is no longer available. Request has been rejected.');
  }

  // Set request status to Approved
  requests[requestIndex].status = 'Approved';
  
  // Set book to unavailable
  books[bookIndex].isAvailable = false;

  // Create a new loan
  const newLoan = {
    id: `loan-${Date.now()}`,
    book: books[bookIndex],
    borrowedDate: new Date(),
    dueDate: addDays(new Date(), 14), // Loan period of 14 days
  };
  loans.push(newLoan);
  
  revalidatePath('/admin');
  revalidatePath('/admin/books');
  return { success: true, message: 'Request approved and loan created.' };
}

export async function rejectRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const requestIndex = requests.findIndex((r) => r.id === requestId);
  const user = users[0];

  if (requestIndex !== -1 && user?.role === 'admin') {
    requests[requestIndex].status = 'Rejected';
    // Note: We are not making the book available again here,
    // as another user might have a pending request for it.
    // A more complex system would handle this queue.
    revalidatePath('/admin');
    return { success: true, message: 'Request rejected.' };
  }

  throw new Error('Failed to reject request.');
}
