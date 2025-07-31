import { getBooks } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AdminBooksPage() {
  const books = getBooks();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Book Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove books from the catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Book
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Catalog</CardTitle>
          <CardDescription>
            There are {books.length} books in the catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          width={40}
                          height={60}
                          className="rounded-sm object-cover"
                          data-ai-hint="book cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge variant={book.isAvailable ? 'secondary' : 'outline'}>
                          {book.isAvailable ? 'Available' : 'On Loan'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/books/${book.id}/edit`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No books in catalog.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
