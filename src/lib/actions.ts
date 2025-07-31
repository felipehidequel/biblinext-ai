'use server';

import { revalidatePath } from 'next/cache';
import { books, requests, users } from './data';
import type { LoanRequest } from './types';

// In a real app, you would have proper user authentication and state management.
// For now, we'll work with the mock data.

export async function requestLoan(formData: FormData) {
  const bookId = formData.get('bookId') as string;
  const book = books.find((b) => b.id === bookId);
  const user = users[0]; // Assume a single logged-in user

  if (!book) {
    throw new Error('Book not found.');
  }

  if (!book.isAvailable) {
    throw new Error('Book is currently unavailable.');
  }

  if (user) {
    // Set book to unavailable
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].isAvailable = false;
    }

    // Create a new request
    const newRequest: LoanRequest = {
      id: `req-${Date.now()}`,
      book: book,
      requestDate: new Date(),
      status: 'Pending',
    };
    requests.unshift(newRequest);

    revalidatePath('/');
    revalidatePath('/my-requests');

    return { success: true, message: 'Loan requested successfully.' };
  }

  throw new Error('User not found.');
}

export async function approveRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const requestIndex = requests.findIndex((r) => r.id === requestId);
  const user = users[0];

  if (requestIndex !== -1 && user?.role === 'admin') {
    requests[requestIndex].status = 'Approved';
    revalidatePath('/admin');
    revalidatePath('/my-requests');
    return { success: true, message: 'Request approved.' };
  }
  
  throw new Error('Failed to approve request.');
}

export async function rejectRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const requestIndex = requests.findIndex((r) => r.id === requestId);
  const user = users[0];

  if (requestIndex !== -1 && user?.role === 'admin') {
    const bookId = requests[requestIndex].book.id;
    requests[requestIndex].status = 'Rejected';
    
    // Make the book available again
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].isAvailable = true;
    }
    
    revalidatePath('/admin');
    revalidatePath('/my-requests');
    revalidatePath('/');
    return { success: true, message: 'Request rejected.' };
  }

  throw new Error('Failed to reject request.');
}
