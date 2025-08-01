import { BookForm } from '@/components/book-form';
import { createBook } from '@/lib/actions';

export default function NewBookPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Adicionar Novo Livro</h1>
      <BookForm action={createBook} />
    </div>
  );
}
