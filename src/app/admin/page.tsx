
import { getPendingRequests } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { approveRequest, rejectRequest } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ptBR } from 'date-fns/locale';

export default async function AdminPage() {
  const pendingRequests = await getPendingRequests();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Painel do Administrador</h1>
        <p className="text-muted-foreground">Gerencie as solicitações de empréstimo pendentes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            Existem {pendingRequests.length} solicitaç{pendingRequests.length !== 1 ? 'ões' : 'ão'} pendente{pendingRequests.length !== 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título do Livro</TableHead>
                  <TableHead>Solicitado por</TableHead>
                  <TableHead>Status do Usuário</TableHead>
                  <TableHead>Data da Solicitação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.book?.title}</TableCell>
                      <TableCell>{request.user?.name}</TableCell>
                      <TableCell>
                        <Badge variant={request.user?.status === 'regular' ? 'secondary' : 'destructive'}>
                          {request.user?.status === 'regular' ? 'Regular' : 'Irregular'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(request.requestDate), 'PPP', { locale: ptBR })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <form action={approveRequest}>
                            <input type="hidden" name="requestId" value={request.id} />
                            <Button size="sm" variant="outline">Aprovar</Button>
                          </form>
                          <form action={rejectRequest}>
                            <input type="hidden" name="requestId" value={request.id} />
                            <Button size="sm" variant="destructive-outline">Rejeitar</Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma solicitação pendente.
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
