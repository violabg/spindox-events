'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { getContestById } from '@/queries/contests';
import { formatDate } from '@/lib/date';
import Link from 'next/link';

type Contest = Awaited<ReturnType<typeof getContestById<undefined>>>;

interface ContestInformationCardProps {
  contest: Exclude<Contest, null>;
}

export default function ContestInformationCard({ contest }: ContestInformationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 w-full">
            <h2 className="text-xl font-bold">{contest.name}</h2>
            <Badge variant={contest.status === 'active' ? 'default' : 'secondary'}>{contest.status === 'active' ? 'Active' : 'Inactive'}</Badge>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild size="icon" variant="outline" className="h-8 w-8">
                <Link href={`/${contest.slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        {isOpen && (
          <CardContent className="space-y-2 py-3">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">ID</p>
                <p className="text-xs">{contest.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Slug</p>
                <p className="text-xs">{contest.slug}</p>
              </div>
            </div>

            {/* Description and Theme */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                <p className="text-xs">{contest.description || <span className="italic">—</span>}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Theme</p>
                <p className="text-xs">{contest.theme || <span className="italic">—</span>}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Created</p>
                <p className="text-xs">{formatDate(contest.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Updated</p>
                <p className="text-xs">{formatDate(contest.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
