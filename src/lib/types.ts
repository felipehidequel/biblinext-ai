export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isAvailable: boolean;
  genre: string;
}

export interface Loan {
  id: string;
  book: Book;
  borrowedDate: Date;
  dueDate: Date;
}

export interface LoanRequest {
  id: string;
  book: Book;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
}
