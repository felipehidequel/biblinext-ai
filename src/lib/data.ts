import type { User, Book, Loan, LoanRequest } from './types';
import { subDays, addDays } from 'date-fns';

export let users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'admin',
  },
];

export let books: Book[] = [
  {
    id: 'book-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Fantasy',
  },
  {
    id: 'book-2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: false,
    genre: 'Sci-Fi',
  },
  {
    id: 'book-3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Sci-Fi',
  },
  {
    id: 'book-4',
    title: 'The Four Winds',
    author: 'Kristin Hannah',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Historical Fiction',
  },
  {
    id: 'book-5',
    title: 'The Push',
    author: 'Ashley Audrain',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: false,
    genre: 'Thriller',
  },
  {
    id: 'book-6',
    title: 'Circe',
    author: 'Madeline Miller',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Fantasy',
  },
  {
    id: 'book-7',
    title: 'Dune',
    author: 'Frank Herbert',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Sci-Fi',
  },
    {
    id: 'book-8',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: 'https://placehold.co/300x400.png',
    isAvailable: true,
    genre: 'Memoir',
  },
];

export let loans: Loan[] = [
  {
    id: 'loan-1',
    book: books[1],
    borrowedDate: subDays(new Date(), 10),
    dueDate: addDays(new Date(), 4),
  },
  {
    id: 'loan-2',
    book: books[4],
    borrowedDate: subDays(new Date(), 5),
    dueDate: addDays(new Date(), 9),
  },
];

export let requests: LoanRequest[] = [
  {
    id: 'req-1',
    book: books[2],
    requestDate: subDays(new Date(), 2),
    status: 'Pending',
  },
  {
    id: 'req-2',
    book: books[0],
    requestDate: subDays(new Date(), 1),
    status: 'Approved',
  },
    {
    id: 'req-3',
    book: books[3],
    requestDate: subDays(new Date(), 4),
    status: 'Rejected',
  },
  {
    id: 'req-4',
    book: books[6],
    requestDate: subDays(new Date(), 1),
    status: 'Pending',
  }
];

// Data access functions
export const getBooks = (): Book[] => books;
export const getBookById = (id: string): Book | undefined => books.find(b => b.id === id);
export const getLoansForUser = (userId: string): Loan[] => loans; // simplified
export const getRequestsForUser = (userId: string): LoanRequest[] => requests; // simplified
export const getPendingRequests = (): LoanRequest[] => requests.filter(r => r.status === 'Pending');
export const getUser = (userId: string): User | undefined => users.find(u => u.id === userId);
