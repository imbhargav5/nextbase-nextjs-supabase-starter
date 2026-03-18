# TeamGrid v2 - Phase 2: Profiles & Discovery

**Status:** Phase 1 ✅ Complete → Phase 2 In Progress
**Estimated Duration:** 3-4 days
**Depends On:** Phase 1 (verified working)

---

## Phase 2 Goals

1. View public profiles (`/profile/[username]`)
2. Edit own profile (`/profile/edit`)
3. Discover users (`/discover` with search/filters)
4. Upload avatars & banners to Supabase Storage
5. Manage skills (add/remove tags)

---

## Files to Create

### 1. Pages

```
src/app/(dashboard)/
├── profile/
│   ├── [username]/
│   │   └── page.tsx          ← View public profile
│   └── edit/
│       └── page.tsx          ← Edit own profile
└── discover/
    └── page.tsx              ← User discovery & search
```

### 2. Components

```
src/components/
├── profile/
│   ├── ProfileCard.tsx       ← Display basic info (reusable)
│   ├── ProfileEditor.tsx     ← Edit form for own profile
│   ├── ProfileHeader.tsx     ← Header with banner + avatar
│   ├── ProfileStats.tsx      ← Teams, posts, member since
│   ├── SkillsEditor.tsx      ← Add/remove skills UI
│   └── SkillsBadge.tsx       ← Display skills as badges
├── upload/
│   └── AvatarUploader.tsx    ← Avatar image upload
└── search/
    └── UserSearchFilters.tsx ← Search & filter form
```

### 3. API Routes

```
src/app/api/
├── users/
│   ├── [username]/
│   │   └── route.ts         ← GET public profile by username
│   ├── search/
│   │   └── route.ts         ← GET with filters (already exists)
│   └── me/
│       └── route.ts         ← GET/PUT profile (enhance PUT)
├── uploads/
│   └── avatar/
│       └── route.ts         ← POST avatar → Supabase Storage
└── storage/
    └── route.ts             ← POST banner → Supabase Storage
```

### 4. Hooks

```
src/hooks/
├── useProfile.ts            ← TanStack Query: fetch profile
├── useProfileUpdate.ts      ← Mutation: update profile
├── useAvatarUpload.ts       ← Mutation: upload avatar
├── useUserSearch.ts         ← Query: search users
└── useSkills.ts             ← Manage skills state
```

### 5. Utilities

```
src/lib/
├── upload.ts                ← File validation, compression
└── storage.ts               ← Supabase Storage helpers
```

---

## Step-by-Step Implementation

### Step 1: Configure Supabase Storage (5 min)

In Supabase Dashboard:

1. Go to **Storage**
2. Create bucket: `avatars` (public)
3. Create bucket: `banners` (public)
4. Set RLS policies:

```sql
-- avatars bucket: public read, own write
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Auth users write own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Similar for banners...
```

### Step 2: Create Upload API Routes (30 min)

**`src/app/api/uploads/avatar/route.ts`**

```typescript
import { createServerSupabaseClient } from '@/supabase-clients/server';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${user.id}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    // Update profile
    await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', user.id);

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

**`src/app/api/uploads/banner/route.ts`** (same pattern for banners)

### Step 3: Create Profile Pages (1-2 hours)

**`src/app/(dashboard)/profile/[username]/page.tsx`** - View any public profile

```typescript
'use client';

import { createClient } from '@/supabase-clients/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [params.username, supabase]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return <div className="p-8">Profile not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Banner */}
      {profile.banner_url && (
        <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img src={profile.banner_url} alt="banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Avatar + Name */}
      <div className="flex gap-4 mb-6">
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{profile.display_name}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          {profile.headline && <p className="text-lg mt-1">{profile.headline}</p>}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-medium">{profile.location || '—'}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-600">Joined</p>
          <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**`src/app/(dashboard)/profile/edit/page.tsx`** - Edit own profile

```typescript
'use client';

import { createClient } from '@/supabase-clients/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setFormData(profile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills?.includes(skill)) {
      setFormData((prev: any) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: (prev.skills || []).filter((s: string) => s !== skill),
    }));
  };

  const handleAvatarUpload = async (file: File) => {
    const formDataToPost = new FormData();
    formDataToPost.append('file', file);

    const response = await fetch('/api/uploads/avatar', {
      method: 'POST',
      body: formDataToPost,
    });

    if (response.ok) {
      const data = await response.json();
      setFormData((prev: any) => ({ ...prev, avatar_url: data.url }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push(`/profile/${formData.username}`);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="space-y-4">
        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Avatar</label>
          {formData.avatar_url && (
            <img src={formData.avatar_url} alt="avatar" className="w-24 h-24 rounded-full mb-2 object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium mb-1">
            Display Name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            value={formData.display_name || ''}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Headline */}
        <div>
          <label htmlFor="headline" className="block text-sm font-medium mb-1">
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            placeholder="e.g., Software Engineer at Acme"
            value={formData.headline || ''}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            value={formData.location || ''}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills?.map((skill: string) => (
              <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="font-bold cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a skill and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSkillAdd((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
```

### Step 4: Create Discovery Page (1 hour)

**`src/app/(dashboard)/discover/page.tsx`**

```typescript
'use client';

import { createClient } from '@/supabase-clients/client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiscoverPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (skills) params.append('skills', skills);
    if (location) params.append('location', location);

    const response = await fetch(`/api/users/search?${params}`);
    const data = await response.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [search, skills, location]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Discover Users</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by skills (comma-separated)..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              {user.avatar_url && (
                <img src={user.avatar_url} alt={user.display_name} className="w-12 h-12 rounded-full object-cover mb-2" />
              )}
              <h3 className="font-bold">{user.display_name}</h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
              {user.headline && <p className="text-sm mt-2">{user.headline}</p>}
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No users found. Try different search terms.
        </div>
      )}
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Create avatar upload test (try JPG, PNG, WebP)
- [ ] Create banner upload test
- [ ] Edit profile: update display name, headline, bio, location
- [ ] Add 3-5 skills and remove one
- [ ] View own profile at `/profile/[username]`
- [ ] Search by name on `/discover`
- [ ] Filter by skills on `/discover`
- [ ] Filter by location on `/discover`
- [ ] Click user card on discover → view profile

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Upload fails with 413 | File too large | Check MAX_FILE_SIZE (5MB) |
| Avatars not showing | CORS issue | Check Supabase Storage bucket settings |
| Search returns nothing | Username doesn't exist | Check profile was created |
| Skills not showing | Array not serialized | Verify skills[] in PUT request |

---

## Next Phase (Phase 3)

Once Phase 2 is complete, move to Teams & Invites:
- Team creation form
- Invite users to team
- Accept/decline invites
- Real-time notifications
- Roster management

**Estimated: 5-6 days**
