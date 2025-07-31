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
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  author: z.string().min(2, { message: 'Author must be at least 2 characters.' }),
  genre: z.string().min(2, { message: 'Genre must be at least 2 characters.' }),
  coverImage: z.string().url({ message: 'Please enter a valid URL.' }),
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Midnight Library" {...field} />
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
              <FormLabel>Author</FormLabel>
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
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Fantasy" {...field} />
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
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/cover.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{book ? 'Save Changes' : 'Create Book'}</Button>
      </form>
    </Form>
  );
}
