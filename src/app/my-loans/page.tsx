import { getLoansForUser } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function MyLoansPage() {
  const loans = getLoansForUser('user-1'); // Simplified for one user

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Loans</h1>
        <p className="text-muted-foreground">A history of books you have borrowed.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Loans</CardTitle>
          <CardDescription>
            You have {loans.length} book{loans.length !== 1 && 's'} currently on loan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Borrowed On</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.book.title}</TableCell>
                    <TableCell>{loan.book.author}</TableCell>
                    <TableCell>{format(loan.borrowedDate, 'PPP')}</TableCell>
                    <TableCell>{format(loan.dueDate, 'PPP')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    You have no books on loan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
