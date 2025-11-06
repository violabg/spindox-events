import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center items-center space-x-2">
            <Lock className="w-6 h-6" />
            <CardTitle className="text-2xl">401 Unauthorized</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p>You do not have permission to access this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
