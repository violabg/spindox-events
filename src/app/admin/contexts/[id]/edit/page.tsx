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
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/contexts/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Edit Context</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Update the context information</p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Context Details</CardTitle>
          <CardDescription>Update the information for &ldquo;{context.name}&rdquo;</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ContextForm contextId={id} initialData={context} />
        </CardContent>
      </Card>
    </div>
  );
}
