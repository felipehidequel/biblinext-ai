
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
  bookId: string;
  userId: string;
  borrowedDate: Date;
  dueDate: Date;
}

export interface LoanRequest {
  id:string;
  bookId: string;
  userId: string;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  // For UI display
  book?: Book;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  status: 'regular' | 'irregular';
}
