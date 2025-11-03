import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getContextAction } from '@/actions/contexts/get.action';
import ContextForm from '../../context.form';

interface EditContextPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContextPage({ params }: EditContextPageProps) {
  const { id } = await params;

  const result = await getContextAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const context = result.data;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/contexts/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Context</h1>
          <p className="text-muted-foreground">Update the context information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Context Details</CardTitle>
          <CardDescription>Update the information for &ldquo;{context.name}&rdquo;</CardDescription>
        </CardHeader>
        <CardContent>
          <ContextForm contextId={id} initialData={context} />
        </CardContent>
      </Card>
    </div>
  );
}
