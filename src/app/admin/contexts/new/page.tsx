import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContextForm from '../context.form';

export default function NewContextPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Create New Context</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Add a new event context to the system</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Context Details</CardTitle>
          <CardDescription>Fill in the information for the new context</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ContextForm />
        </CardContent>
      </Card>
    </div>
  );
}
