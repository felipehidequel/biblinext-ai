'use client';
import { BookForm } from '@/components/book-form';
import { updateBook } from '@/lib/actions';
import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function EditBookPage({ params }: { params: { id: string } }) {
  const book = getBookById(params.id);

  if (!book) {
    notFound();
  }

  const updateBookWithId = updateBook.bind(null, book.id);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Edit Book</h1>
      <BookForm action={updateBookWithId} book={book} />
    </div>
  );
}
