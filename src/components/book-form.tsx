'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Book } from '@/lib/types';
import { useRouter } from 'next/navigation';

const bookFormSchema = z.object({
  title: z.string().min(2, { message: 'O título deve ter pelo menos 2 caracteres.' }),
  author: z.string().min(2, { message: 'O autor deve ter pelo menos 2 caracteres.' }),
  genre: z.string().min(2, { message: 'O gênero deve ter pelo menos 2 caracteres.' }),
  coverImage: z.string().url({ message: 'Por favor, insira uma URL válida.' }),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  action: (data: FormData) => Promise<any>;
  book?: Book | null;
}

export function BookForm({ action, book }: BookFormProps) {
  const router = useRouter();
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      coverImage: book?.coverImage || 'https://placehold.co/300x400.png',
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    await action(formData);
    router.push('/admin/books');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="A Biblioteca da Meia-Noite" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor</FormLabel>
              <FormControl>
                <Input placeholder="Matt Haig" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <FormControl>
                <Input placeholder="Fantasia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem de Capa</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/capa.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{book ? 'Salvar Alterações' : 'Criar Livro'}</Button>
      </form>
    </Form>
  );
}
