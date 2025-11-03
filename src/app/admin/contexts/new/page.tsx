import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateContextForm from './create-context.form';

export default function NewContextPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Context</h1>
          <p className="text-muted-foreground">Add a new event context to the system</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Context Details</CardTitle>
          <CardDescription>Fill in the information for the new context</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateContextForm />
        </CardContent>
      </Card>
    </div>
  );
}
