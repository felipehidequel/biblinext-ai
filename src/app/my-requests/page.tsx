import { getRequestsForUser } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyRequestsPage() {
  const requests = getRequestsForUser('user-1');

  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
    Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
    Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  };

  const statusIcons = {
    Pending: <Clock className="h-3.5 w-3.5 mr-1.5" />,
    Approved: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
    Rejected: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Requests</h1>
        <p className="text-muted-foreground">Track the status of your loan requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>You have made {requests.length} request{requests.length !== 1 && 's'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.book.title}</TableCell>
                      <TableCell>{request.book.author}</TableCell>
                      <TableCell>{format(request.requestDate, 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('flex items-center w-fit', statusStyles[request.status])}>
                         {statusIcons[request.status]}
                         <span>{request.status}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      You have not made any requests.
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
