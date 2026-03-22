'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Grant {
  shares: number;
  grantDate: string;
  cliffMonths: number;
  vestMonths: number;
  grantType: string;
}

interface VestingTimelineProps {
  grant: Grant;
  totalShares: number;
}

export function VestingTimeline({ grant, totalShares }: VestingTimelineProps) {
  const { vestedPct, cliffReached, monthsIn } = useMemo(() => {
    const now = new Date();
    const start = new Date(grant.grantDate);
    const months = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const cliff = grant.cliffMonths;
    const total = grant.vestMonths;
    const cliffReached = months >= cliff;
    const vestedPct = cliffReached
      ? Math.min(100, Math.floor((months / total) * 100))
      : 0;
    
    return { vestedPct, cliffReached, monthsIn: months };
  }, [grant]);

  const ownershipPct = ((grant.shares / totalShares) * 100).toFixed(4);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold capitalize">
            {grant.grantType} Grant
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {grant.shares.toLocaleString()} shares ({ownershipPct}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {cliffReached 
                ? `${vestedPct}% vested` 
                : `Cliff in ${grant.cliffMonths - monthsIn} months`
              }
            </span>
            <span>{grant.vestMonths}mo total vest</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              style={{ width: `${vestedPct}%` }}
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {cliffReached
            ? `${Math.floor((grant.shares * vestedPct) / 100)} shares vested`
            : 'Vesting begins after cliff'
          }
          {' · '}
          <span className="text-primary font-medium">
            Display only — verify with your cap table tool
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          <div>Grant Date: {new Date(grant.grantDate).toLocaleDateString()}</div>
          <div>Cliff: {grant.cliffMonths} months</div>
          <div>Total Vesting: {grant.vestMonths} months</div>
        </div>
      </CardContent>
    </Card>
  );
}