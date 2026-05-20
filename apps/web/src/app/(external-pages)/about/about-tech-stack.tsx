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
    <Card>
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
        <CardDescription>
          Built with modern, production-ready technologies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech) => (
            <div key={tech} className="flex items-center gap-2">
              <Badge>{tech}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
