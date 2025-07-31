'use client';

import { useState, useMemo } from 'react';
import { getBooks } from '@/lib/data';
import { BookCard } from '@/components/book-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Book } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const books: Book[] = useMemo(() => getBooks(), []);

  const filteredBooks = useMemo(
    () =>
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [books, searchTerm]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Book Catalog</h1>
          <p className="text-muted-foreground">Browse and request books from our collection.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search by title or author"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <AnimatePresence>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
