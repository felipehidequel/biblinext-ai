import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requestLoan } from '@/lib/actions';
import type { Book } from '@/lib/types';
import { CircleCheck, CircleX } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BookCard({ book }: { book: Book }) {
  return (
    <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="hidden" className="h-full">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover"
              data-ai-hint="book cover"
            />
          </div>
        </CardHeader>
        <div className="p-4 flex flex-col flex-grow">
          <CardTitle className="text-base font-bold leading-tight font-headline mb-1 line-clamp-2">
            {book.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-4">{book.author}</p>
          <div className="flex-grow"></div>
          <Badge
            variant={book.isAvailable ? 'secondary' : 'outline'}
            className="w-fit"
          >
            {book.isAvailable ? (
              <CircleCheck className="mr-1 h-3 w-3 text-green-600" />
            ) : (
              <CircleX className="mr-1 h-3 w-3 text-red-600" />
            )}
            {book.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <CardFooter className="p-4 bg-muted/50">
          <form action={requestLoan} className="w-full">
            <input type="hidden" name="bookId" value={book.id} />
            <Button disabled={!book.isAvailable} className="w-full">
              Request Loan
            </Button>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
