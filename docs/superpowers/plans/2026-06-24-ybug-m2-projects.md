# Milestone 2 — Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let workspace admins create projects, each with a public key + allowed-domains list, view a copy-paste install snippet, and expose a public `GET /api/widget-config` endpoint the widget calls to validate its key.

**Architecture:** A `projects` table scoped to a workspace via the M1 RLS helpers. Public keys are generated app-side. The widget-config endpoint uses the service-role client (anonymous caller) and returns only non-sensitive config; its response shape is built by a pure, unit-tested function.

**Tech Stack:** Supabase + RLS, pgTAP, Next.js route handlers, `next-safe-action`, Vitest, shadcn/ui.

**Prereq:** M1 complete. **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `apps/database/supabase/migrations/<ts>_create_projects.sql`
- Create: `apps/database/supabase/tests/projects_test.sql`
- Create: `apps/web/src/utils/widget/domain-match.ts` — `isOriginAllowed()`
- Create: `apps/web/src/utils/widget/__tests__/domain-match.test.ts`
- Create: `apps/web/src/utils/projects/public-key.ts` — `generatePublicKey()`
- Create: `apps/web/src/utils/projects/__tests__/public-key.test.ts`
- Create: `apps/web/src/data/user/projects.ts` — queries + actions
- Create: `apps/web/src/app/api/widget-config/config.ts` — `buildWidgetConfig()` (pure)
- Create: `apps/web/src/app/api/widget-config/__tests__/config.test.ts`
- Create: `apps/web/src/app/api/widget-config/route.ts`
- Create: `apps/web/src/app/(app-pages)/projects/page.tsx` + `CreateProjectForm.tsx` + `projects-list.tsx`
- Create: `apps/web/src/app/(app-pages)/projects/[projectId]/page.tsx` + `InstallSnippet.tsx` + `ProjectSettingsForm.tsx`
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx` — add a "Projects" nav link.

---

## Task 1: `projects` table + RLS

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_projects.sql`
- Test: `apps/database/supabase/tests/projects_test.sql`

- [ ] **Step 1: Write the failing test**

Create `apps/database/supabase/tests/projects_test.sql`:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(6);

SELECT has_table('public', 'projects', 'projects table exists');
SELECT col_type_is('public', 'projects', 'public_key', 'text', 'public_key is text');
SELECT col_type_is('public', 'projects', 'allowed_domains', 'text[]', 'allowed_domains is text[]');
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.projects'::regclass),
  true,
  'RLS enabled on projects'
);

-- Isolation: members of one workspace cannot read another workspace's projects
INSERT INTO auth.users (id, email) VALUES
  ('33333333-3333-3333-3333-333333333333', 'a@p.com'),
  ('44444444-4444-4444-4444-444444444444', 'b@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'P A', 'p-a', '33333333-3333-3333-3333-333333333333'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'P B', 'p-b', '44444444-4444-4444-4444-444444444444');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '33333333-3333-3333-3333-333333333333', 'owner'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', '44444444-4444-4444-4444-444444444444', 'owner');
INSERT INTO public.projects (workspace_id, name, public_key) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Site A', 'pk_a'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Site B', 'pk_b');

SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

SELECT results_eq(
  'SELECT count(*) FROM public.projects',
  ARRAY[1::bigint],
  'User A sees only their workspace project'
);
SELECT is(
  (SELECT name FROM public.projects LIMIT 1),
  'Site A',
  'User A sees Site A only'
);

SELECT * FROM finish();
ROLLBACK;
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — `relation "public.projects" does not exist`.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_projects`
Paste:

```sql
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  name text NOT NULL,
  public_key text NOT NULL UNIQUE,
  allowed_domains text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON public.projects (workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_public_key ON public.projects (public_key);

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_select ON public.projects
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY projects_insert ON public.projects
  FOR INSERT WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY projects_update ON public.projects
  FOR UPDATE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY projects_delete ON public.projects
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (6 tests).

- [ ] **Step 5: Regenerate types + commit**

```bash
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
cd ../..
git add apps/database/supabase/migrations apps/database/supabase/tests/projects_test.sql apps/web/src/lib/database.types.ts
git commit -m "feat(db): add projects table with workspace-scoped RLS"
```

---

## Task 2: `generatePublicKey` utility

**Files:**

- Create: `apps/web/src/utils/projects/public-key.ts`
- Test: `apps/web/src/utils/projects/__tests__/public-key.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/projects/__tests__/public-key.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generatePublicKey } from "../public-key";

describe("generatePublicKey", () => {
  it("is prefixed with pk_", () => {
    expect(generatePublicKey().startsWith("pk_")).toBe(true);
  });
  it("only uses url-safe characters", () => {
    expect(generatePublicKey()).toMatch(/^pk_[A-Za-z0-9_-]+$/);
  });
  it("is reasonably long and unique", () => {
    const a = generatePublicKey();
    const b = generatePublicKey();
    expect(a.length).toBeGreaterThan(20);
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/projects/__tests__/public-key.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/projects/public-key.ts`:

```ts
/**
 * Generates a public, embeddable project key (safe to ship in a <script> tag).
 * Uses the Web Crypto API available in Node 24 and the Next.js runtimes.
 */
export function generatePublicKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64Url = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `pk_${base64Url}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/projects/__tests__/public-key.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/projects
git commit -m "feat(web): add public project key generator"
```

---

## Task 3: `isOriginAllowed` domain matcher

**Files:**

- Create: `apps/web/src/utils/widget/domain-match.ts`
- Test: `apps/web/src/utils/widget/__tests__/domain-match.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/widget/__tests__/domain-match.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isOriginAllowed } from "../domain-match";

describe("isOriginAllowed", () => {
  it("denies when the allowlist is empty", () => {
    expect(isOriginAllowed("https://example.com", [])).toBe(false);
  });
  it("denies a null/missing origin", () => {
    expect(isOriginAllowed(null, ["example.com"])).toBe(false);
  });
  it("matches an exact host", () => {
    expect(isOriginAllowed("https://example.com", ["example.com"])).toBe(true);
  });
  it("ignores protocol, port and path in the allowlist entry", () => {
    expect(
      isOriginAllowed("https://example.com", ["http://example.com:8080/foo"])
    ).toBe(true);
  });
  it("matches a wildcard subdomain", () => {
    expect(isOriginAllowed("https://app.example.com", ["*.example.com"])).toBe(
      true
    );
  });
  it("wildcard also matches the apex domain", () => {
    expect(isOriginAllowed("https://example.com", ["*.example.com"])).toBe(
      true
    );
  });
  it("does not match a different domain", () => {
    expect(isOriginAllowed("https://evil.com", ["example.com"])).toBe(false);
  });
  it("supports localhost", () => {
    expect(isOriginAllowed("http://localhost:3000", ["localhost"])).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/domain-match.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/widget/domain-match.ts`:

```ts
function toHost(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^[a-z]+:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withProtocol).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Returns true when `origin` (e.g. an incoming request Origin header) is allowed
 * by `allowedDomains`. Entries may be bare hosts, full origins, or wildcard
 * subdomains like `*.example.com` (which also matches the apex). Empty list = deny.
 */
export function isOriginAllowed(
  origin: string | null | undefined,
  allowedDomains: string[]
): boolean {
  if (!origin || allowedDomains.length === 0) return false;
  const originHost = toHost(origin);
  if (!originHost) return false;

  return allowedDomains.some((entry) => {
    const raw = entry.trim().toLowerCase();
    if (raw.startsWith("*.")) {
      const apex = raw.slice(2);
      return originHost === apex || originHost.endsWith(`.${apex}`);
    }
    const entryHost = toHost(raw);
    return entryHost !== null && originHost === entryHost;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/domain-match.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/widget
git commit -m "feat(web): add origin/domain allowlist matcher"
```

---

## Task 4: Projects data layer + actions

**Files:**

- Create: `apps/web/src/data/user/projects.ts`

- [ ] **Step 1: Implement the data module**

Create `apps/web/src/data/user/projects.ts`:

```ts
"use server";

import { authActionClient } from "@/lib/safe-action";
import { createSupabaseClient } from "@/supabase-clients/server";
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import { generatePublicKey } from "@/utils/projects/public-key";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getProjects() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProject(projectId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

const createProjectSchema = z.object({ name: z.string().min(1).max(80) });

export const createProjectAction = authActionClient
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        workspace_id: membership.workspace!.id,
        name: parsedInput.name,
        public_key: generatePublicKey(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    revalidatePath("/projects");
    return { projectId: data.id };
  });

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(80).optional(),
  allowed_domains: z.array(z.string().min(1)).optional(),
  is_active: z.boolean().optional(),
});

export const updateProjectAction = authActionClient
  .schema(updateProjectSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput;
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from("projects").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    return { success: true };
  });
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && pnpm tsc --noEmit`
Expected: clean (relies on regenerated `database.types.ts` from Task 1).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/data/user/projects.ts
git commit -m "feat(web): add projects data layer and create/update actions"
```

---

## Task 5: `GET /api/widget-config`

**Files:**

- Create: `apps/web/src/app/api/widget-config/config.ts`
- Test: `apps/web/src/app/api/widget-config/__tests__/config.test.ts`
- Create: `apps/web/src/app/api/widget-config/route.ts`

- [ ] **Step 1: Write the failing test for the pure builder**

Create `apps/web/src/app/api/widget-config/__tests__/config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildWidgetConfig } from "../config";

describe("buildWidgetConfig", () => {
  it("returns inactive for a missing project", () => {
    expect(buildWidgetConfig(null)).toEqual({ active: false });
  });
  it("returns inactive when the project is disabled", () => {
    expect(buildWidgetConfig({ id: "p1", is_active: false })).toEqual({
      active: false,
    });
  });
  it("returns active config with theme defaults when enabled", () => {
    const result = buildWidgetConfig({ id: "p1", is_active: true });
    expect(result.active).toBe(true);
    expect(result).toHaveProperty("theme");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/app/api/widget-config/__tests__/config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the pure builder**

Create `apps/web/src/app/api/widget-config/config.ts`:

```ts
export type WidgetConfigProject = { id: string; is_active: boolean } | null;

export type WidgetConfig =
  | { active: false }
  | {
      active: true;
      theme: { buttonColor: string; position: "bottom-right" | "bottom-left" };
    };

export function buildWidgetConfig(project: WidgetConfigProject): WidgetConfig {
  if (!project || !project.is_active) {
    return { active: false };
  }
  return {
    active: true,
    theme: { buttonColor: "#5b6cff", position: "bottom-right" },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/app/api/widget-config/__tests__/config.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement the route handler**

Create `apps/web/src/app/api/widget-config/route.ts`:

```ts
import { createServiceRoleClient } from "@/supabase-clients/service-role";
import { type NextRequest, NextResponse } from "next/server";
import { buildWidgetConfig } from "./config";

// Config is non-sensitive, so we allow any origin to read it.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json(
      { active: false },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, is_active")
    .eq("public_key", key)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { active: false },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(buildWidgetConfig(data), { headers: CORS_HEADERS });
}
```

- [ ] **Step 6: Manual verification**

With a project created in the UI (Task 6) or seeded, run `pnpm web#dev` and:

```bash
curl "http://localhost:3000/api/widget-config?key=<public_key>"
```

Expected: `{"active":true,"theme":{...}}`. Unknown key → `{"active":false}`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app/api/widget-config
git commit -m "feat(web): add public widget-config endpoint"
```

---

## Task 6: Projects list page + create form

**Files:**

- Create: `apps/web/src/app/(app-pages)/projects/page.tsx`
- Create: `apps/web/src/app/(app-pages)/projects/CreateProjectForm.tsx`
- Create: `apps/web/src/app/(app-pages)/projects/projects-list.tsx`

- [ ] **Step 1: Server page**

Create `apps/web/src/app/(app-pages)/projects/page.tsx`:

```tsx
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import { getProjects } from "@/data/user/projects";
import { CreateProjectForm } from "./CreateProjectForm";
import { ProjectsList } from "./projects-list";

export default async function ProjectsPage() {
  await requireCurrentWorkspace();
  const projects = await getProjects();
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <CreateProjectForm />
      </div>
      <ProjectsList projects={projects} />
    </div>
  );
}
```

- [ ] **Step 2: Create form (dialog)**

Create `apps/web/src/app/(app-pages)/projects/CreateProjectForm.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createProjectAction } from "@/data/user/projects";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { execute, status } = useAction(createProjectAction, {
    onSuccess: ({ data }) => {
      toast.success("Project created");
      setOpen(false);
      setName("");
      router.refresh();
      if (data?.projectId) router.push(`/projects/${data.projectId}`);
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            execute({ name });
          }}
          className="space-y-4"
        >
          <Input
            placeholder="My website"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            type="submit"
            disabled={status === "executing" || name.length === 0}
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Projects list**

Create `apps/web/src/app/(app-pages)/projects/projects-list.tsx`:

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Database } from "@/lib/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function ProjectsList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground">
        No projects yet. Create your first one.
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card className="transition hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.is_active ? "default" : "secondary"}>
                  {project.is_active ? "Active" : "Paused"}
                </Badge>
              </div>
              <CardDescription>
                {project.allowed_domains.length} allowed domain(s)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `pnpm web#dev` → visit `/projects` → create a project → it appears and links to its detail page. Then `pnpm typecheck && pnpm lint`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/projects
git commit -m "feat(web): add projects list and create flow"
```

---

## Task 7: Project detail — install snippet, domains, active toggle

**Files:**

- Create: `apps/web/src/app/(app-pages)/projects/[projectId]/page.tsx`
- Create: `apps/web/src/app/(app-pages)/projects/[projectId]/InstallSnippet.tsx`
- Create: `apps/web/src/app/(app-pages)/projects/[projectId]/ProjectSettingsForm.tsx`

- [ ] **Step 1: Server detail page**

Create `apps/web/src/app/(app-pages)/projects/[projectId]/page.tsx`:

```tsx
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import { getProject } from "@/data/user/projects";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { InstallSnippet } from "./InstallSnippet";
import { ProjectSettingsForm } from "./ProjectSettingsForm";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await requireCurrentWorkspace();
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <InstallSnippet origin={origin} publicKey={project.public_key} />
      <ProjectSettingsForm project={project} />
    </div>
  );
}
```

- [ ] **Step 2: Install snippet (copy button)**

Create `apps/web/src/app/(app-pages)/projects/[projectId]/InstallSnippet.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function InstallSnippet({
  origin,
  publicKey,
}: {
  origin: string;
  publicKey: string;
}) {
  const snippet = `<script async src="${origin}/widget.js" data-project-key="${publicKey}"></script>`;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install snippet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">
          {snippet}
        </pre>
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(snippet);
            toast.success("Snippet copied");
          }}
        >
          Copy snippet
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Settings form (domains + active)**

Create `apps/web/src/app/(app-pages)/projects/[projectId]/ProjectSettingsForm.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateProjectAction } from "@/data/user/projects";
import type { Database } from "@/lib/database.types";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function ProjectSettingsForm({ project }: { project: Project }) {
  const router = useRouter();
  const [domains, setDomains] = useState(project.allowed_domains.join("\n"));
  const [isActive, setIsActive] = useState(project.is_active);
  const { execute, status } = useAction(updateProjectAction, {
    onSuccess: () => {
      toast.success("Saved");
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed"),
  });

  const save = () =>
    execute({
      id: project.id,
      allowed_domains: domains
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
      is_active: isActive,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Allowed domains (one per line; supports *.example.com)</Label>
          <Textarea
            rows={4}
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder={"example.com\n*.example.com\nlocalhost"}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label>Active</Label>
        </div>
        <Button onClick={save} disabled={status === "executing"}>
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Verify**

Run `pnpm web#dev` → open a project → add `localhost` to allowed domains, save → reload shows persisted values. `pnpm typecheck && pnpm lint`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/projects/'[projectId]'
git commit -m "feat(web): add project detail, install snippet, and settings"
```

---

## Task 8: Sidebar nav link

**Files:**

- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx`

- [ ] **Step 1: Add a Projects nav item**

In `apps/web/src/app/(app-pages)/app-sidebar-client.tsx`, add `FolderKanban` to the `lucide-react` import and add a Projects entry to the `navigationItems` array near the top of the file:

```tsx
import { ChevronUp, FolderKanban, Home, Lock, LogOut, Settings } from "lucide-react";

const navigationItems: { title: string; url: string; icon: React.ElementType }[] = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Private Items', url: '/private-items', icon: Lock },
];
```

(The `Dashboard` and `Private Items` entries are removed in M7 when the demo is deleted.)

- [ ] **Step 2: Verify + commit**

Run `pnpm web#dev` → the sidebar shows "Projects" and navigates correctly. Then:

```bash
git add apps/web/src/app/'(app-pages)'/app-sidebar-client.tsx
git commit -m "feat(web): add projects link to app sidebar"
```

---

## Self-check (end of milestone)

- [ ] `cd apps/database && supabase test db` → projects tests pass.
- [ ] `pnpm --filter web test` → public-key, domain-match, widget-config config tests pass.
- [ ] `pnpm typecheck && pnpm lint` → clean.
- [ ] You can create a project, copy its snippet, set allowed domains, and `GET /api/widget-config?key=...` returns the right shape.
