'use client';

import { deleteContestAction } from '@/actions/contests/delete.action';
import { ConfirmationDialog } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function DeleteContestButton({ contestId, contestName }: { contestId: string; contestName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContestAction(contestId);
      if (result.success) {
        toast.success('Contest deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete contest');
      }
    } catch {
      toast.error('Failed to delete contest');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationDialog
      title="Delete Contest"
      description={`Are you sure you want to delete "${contestName}"? This action cannot be undone and will fail if the contest has associated questions or user answers.`}
      actionText="Delete"
      onAction={handleDelete}
      isLoading={isDeleting}
      isDangerous
    >
      <Button variant="outline" size="sm" disabled={isDeleting}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </ConfirmationDialog>
  );
}

export { DeleteContestButton };
