'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'All', 'Manufacturing', 'Legal', 'Marketing Agency',
  'Design Studio', 'Logistics', 'IT Services', 'Consulting'
];

interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  sub_categories: string[];
  website: string | null;
  location: string | null;
  country: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean;
  is_public: boolean;
  avg_rating: number;
  review_count: number;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function VendorDirectory() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', search, category],
    queryFn: () => fetch(
      `/api/vendors?q=${encodeURIComponent(search)}&category=${category}`
    ).then(r => r.json()),
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <Button
              key={c}
              onClick={() => setCategory(c)}
              variant={category === c ? 'default' : 'outline'}
              className="text-xs"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.vendors?.map((vendor: Vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {vendor.logo_url ? (
            <img
              src={vendor.logo_url}
              className="w-12 h-12 rounded-lg object-cover"
              alt={`${vendor.name} logo`}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              🏢
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate">{vendor.name}</h3>
              {vendor.is_verified && (
                <span className="text-xs text-blue-600 font-medium">✓ Verified</span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs mt-1 capitalize">
              {vendor.category.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {vendor.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{vendor.location || vendor.country || 'Global'}</span>
          </div>
          {vendor.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{vendor.avg_rating.toFixed(1)}</span>
              <span>({vendor.review_count})</span>
            </div>
          )}
        </div>
        {vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {vendor.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {vendor.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{vendor.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {vendor.website && (
          <div className="mt-3">
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}