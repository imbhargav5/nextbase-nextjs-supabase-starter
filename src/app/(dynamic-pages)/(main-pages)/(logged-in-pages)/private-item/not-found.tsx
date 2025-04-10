import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { T } from '@/components/ui/Typography';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card className="border-destructive/20 shadow-lg">
        <CardHeader className="flex items-center justify-center pb-2">
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
          <T.H2 className="text-center">Item Not Found</T.H2>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <T.P className="text-muted-foreground">
            The requested item could not be found. It may have been deleted or
            you might not have permission to view it.
          </T.P>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
