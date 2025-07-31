'use server';

import { revalidatePath } from 'next/cache';
import { books, requests, users } from './data';
import type { LoanRequest } from './types';

export async function approveRequest(formData: FormData) {
  const requestId = formData.get('requestId') as string;
  const requestIndex = requests.findIndex((r) => r.id === requestId);
  const user = users[0];

  if (requestIndex !== -1 && user?.role === 'admin') {
    requests[requestIndex].status = 'Approved';
    revalidatePath('/admin');
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
    revalidatePath('/admin/books');
    return { success: true, message: 'Request rejected.' };
  }

  throw new Error('Failed to reject request.');
}
