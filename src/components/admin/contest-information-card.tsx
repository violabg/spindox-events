'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Calendar, Zap, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getContestById } from '@/queries/contests';
import Link from 'next/link';

type Contest = Awaited<ReturnType<typeof getContestById<undefined>>>;

interface ContestInformationCardProps {
  contest: Exclude<Contest, null>;
}

export default function ContestInformationCard({ contest }: ContestInformationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <Card>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto hover:bg-transparent">
              <div className="flex items-center gap-3 w-full">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <h2 className="text-xl font-bold">{contest.name}</h2>
                <Badge variant={contest.status === 'active' ? 'default' : 'secondary'} className="ml-auto mr-2">
                  {contest.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
                <Button asChild size="icon" variant="outline" className="h-8 w-8">
                  <Link href={`/${contest.slug}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 py-3">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">ID</p>
                <p className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all truncate">{contest.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Slug</p>
                <p className="text-xs font-mono bg-muted px-1 py-0.5 rounded truncate">{contest.slug}</p>
              </div>
            </div>

            {/* Description and Theme */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                <p className="text-xs bg-muted/50 px-1 py-0.5 rounded truncate">{contest.description || <span className="italic">—</span>}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Theme</p>
                <p className="text-xs truncate">{contest.theme || <span className="italic">—</span>}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
                <p className="text-xs truncate">{formatDate(contest.createdAt)}</p>
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  <Zap className="h-2.5 w-2.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Updated</p>
                </div>
                <p className="text-xs truncate">{formatDate(contest.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
