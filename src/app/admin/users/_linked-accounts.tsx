'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/admin';
import { deleteAccountAction } from '@/actions/accounts/delete.action';
import { toast } from 'sonner';

interface Account {
  id: string;
  providerId: string;
  accountId: string;
}

interface _LinkedAccountsProps {
  accounts: Account[];
}

export default function LinkedAccounts_({ accounts }: _LinkedAccountsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteAccount = async (accountId: string) => {
    setIsDeleting(accountId);
    try {
      const result = await deleteAccountAction(accountId);
      if (result.success) {
        toast.success('Account unlinked successfully');
      } else {
        toast.error(result.error || 'Failed to unlink account');
      }
    } catch {
      toast.error('Failed to unlink account');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>External authentication providers</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No linked accounts</p>
        ) : (
          <div className="space-y-2">
            {accounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm capitalize">{account.providerId}</p>
                  <p className="text-xs text-muted-foreground">{account.accountId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ConfirmationDialog
                    title="Unlink Account"
                    description={`Unlink this ${account.providerId} account from the user? They will no longer be able to sign in using this provider.`}
                    actionText="Unlink"
                    onAction={() => handleDeleteAccount(account.id)}
                    isLoading={isDeleting === account.id}
                    isDangerous
                  >
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmationDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
