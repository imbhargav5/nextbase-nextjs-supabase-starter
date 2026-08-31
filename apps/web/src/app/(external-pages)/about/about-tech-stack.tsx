import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AboutTechStackProps {
  technologies: string[];
}

export function AboutTechStack({ technologies }: AboutTechStackProps) {
  return (
    <Card className="border-border/70 bg-muted/20 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Technology stack</CardTitle>
        <CardDescription>
          Popular, documented tools with a strong open-source ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <Badge key={technology} variant="outline" className="bg-background px-3 py-1">
            {technology}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
