
'use client';
import { BookForm } from '@/components/book-form';
import { updateBook } from '@/lib/actions';
import { getBookById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Book } from '@/lib/types';

export default function EditBookPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null | undefined>(undefined);

  useEffect(() => {
    getBookById(params.id).then(fetchedBook => {
      if (!fetchedBook) {
        notFound();
      } else {
        setBook(fetchedBook);
      }
    });
  }, [params.id]);


  if (book === undefined) {
    return <div>Carregando...</div>;
  }
  
  if (book === null) {
      notFound();
  }

  const updateBookWithId = updateBook.bind(null, book.id);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Editar Livro</h1>
      <BookForm action={updateBookWithId} book={book} />
    </div>
  );
}
