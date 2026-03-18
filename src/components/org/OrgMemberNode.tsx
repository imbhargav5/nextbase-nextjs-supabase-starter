'use client';

import { Handle, NodeProps, Position } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OrgMemberNodeData } from '@/types';

export function OrgMemberNode({ data }: NodeProps<OrgMemberNodeData>) {
  const { user, role, department, departmentColor } = data;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card className="w-64 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || '/default-avatar.png'} alt={user.display_name} />
            <AvatarFallback>{user.display_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="font-semibold">{user.display_name}</div>
            <div className="text-sm text-muted-foreground">{role}</div>
            <Badge className="mt-1" style={{ backgroundColor: departmentColor }}>
              {department}
            </Badge>
          </div>
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}