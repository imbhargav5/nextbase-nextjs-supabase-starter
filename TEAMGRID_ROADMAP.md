# TeamGrid v2 - Complete Implementation Roadmap

## Overview

TeamGrid is a Next.js + Supabase social platform combining:
- **LinkedIn:** Professional profiles, discovery, skills
- **Fantasy Football:** Team rosters, scoring, leaderboards
- **Slack:** Internal messaging, channels, real-time chat

**Architecture:** Next.js 14 (App Router) → Supabase Backend → Netlify Deploy

---

## PHASE 1: FOUNDATION ✅ [MOSTLY COMPLETE]

### Database Layer ✅
- [x] 9 SQL migrations created and ready
  - Core (profiles, teams, members, invites)
  - Org structure (departments, titles, org nodes)
  - Feed (posts, comments, reactions)
  - Messaging (channels, messages)
  - Notifications
  - System titles seed
  - Row Level Security (complete authorization)
  - Trigger functions
  - Realtime setup
- [x] All tables with proper constraints
- [x] RLS policies for multi-tenant security

### Authentication ✅
- [x] Supabase Auth setup (no custom JWT)
- [x] OAuth: Google, GitHub, LinkedIn configured in code
- [x] Auth pages:
  - Login page (email + 3x OAuth)
  - Register page (email signup)
  - Forgot password page
  - OAuth callback handler
- [x] Middleware route protection
- [x] Session refresh

### API Foundation ✅
- [x] POST /api/teams (create team)
- [x] GET /api/teams (list user's teams)
- [x] GET /api/users/me (current profile)
- [x] PUT /api/users/me (update profile)
- [x] GET /api/users/search (user discovery)
- [x] Zod validation schemas for:
  - Teams
  - Posts & reactions
  - Invites
  - Profiles

### Dashboard ✅
- [x] Basic dashboard page (/dashboard)
- [x] Welcome message with user profile
- [x] Logout button

### Configuration ✅
- [x] .env.local template with all variables
- [x] Supabase clients (browser + server)
- [x] TypeScript types template
- [x] Permissions matrix utility

### TO COMPLETE (Manual Steps)
- [ ] Save Supabase credentials to .env.local
- [ ] Run `supabase link --project-ref [ref]`
- [ ] Run `supabase db push` (apply migrations)
- [ ] Configure OAuth providers (Google, GitHub, LinkedIn)
- [ ] Test full auth flow (email + 3x OAuth)

**Estimated time:** 30-45 minutes to complete manual steps

---

## PHASE 2: PROFILES & DISCOVERY 📅

### Pages to Build
- [ ] /profile/[username] (view anyone's public profile)
- [ ] /profile/edit (own profile editor)
- [ ] /discover (search + filter users)

### Components
- [ ] ProfileCard (display profile info)
- [ ] ProfileEditor (edit form with avatar/banner upload)
- [ ] SkillsEditor (add/remove skills)
- [ ] UserSearchFilters (location, skills, name)

### API Routes
- [ ] GET /api/users/[username] (view profile)
- [ ] PUT /api/users/me (update profile) [exists, needs enhancement]
- [ ] POST /api/uploads (avatar/banner) - Supabase Storage

### Hooks
- [ ] useProfile(username) - TanStack Query
- [ ] useProfileUpdate() - useMutation

### Features
- Avatar upload to Supabase Storage
- Banner upload to Supabase Storage
- Skills as tag list
- Location + headline
- Bio markdown support

**Estimated time:** 3-4 days

---

## PHASE 3: TEAMS & INVITES 📅

### Pages to Build
- [ ] /team/create (team creation form)
- [ ] /team/[slug] (team overview + roster)
- [ ] /team/[slug]/members (roster with role editor)
- [ ] /team/[slug]/settings (team settings)
- [ ] /notifications (notification center)

### Components
- [ ] TeamRoster (list members with roles)
- [ ] InviteModal (send invites to users)
- [ ] MemberRoleEditor (change role/title/dept)
- [ ] NotificationBell (badge + dropdown)
- [ ] NotificationItem (invite, message, etc.)

### API Routes
- [ ] GET /api/teams/[id] (team + members)
- [ ] PUT /api/teams/[id] (update team)
- [ ] DELETE /api/teams/[id] (delete team)
- [ ] POST /api/teams/[id]/invite (send invite)
- [ ] GET /api/teams/[id]/members (roster)
- [ ] PATCH /api/teams/[id]/members/[userId] (update role)
- [ ] POST /api/invites/[id]/accept (accept invite)
- [ ] POST /api/invites/[id]/decline (decline invite)
- [ ] GET /api/notifications (list)
- [ ] PATCH /api/notifications/[id]/read (mark read)

### Hooks
- [ ] useRealtimeNotifications(userId) - Supabase Realtime
- [ ] useTeamMembers(teamId) - TanStack Query
- [ ] useTeams() - current user's teams

### Features
- Send invite with custom message
- Invite expires in 7 days
- Accept/decline invites
- Real-time notifications
- Notification bell with unread badge
- Auto-add to #general channel on join

**Estimated time:** 5-6 days

---

## PHASE 4: FEED & POSTS �*

### Pages to Build
- [ ] /dashboard (personalized feed)
- [ ] /post/[id] (single post view)

### Components
- [ ] FeedPost (post card with reactions)
- [ ] PostComposer (TipTap editor, visibility toggle)
- [ ] ReactionButtons (like, fire, clap, trophy)
- [ ] CommentThread (nested comments)
- [ ] PostMediaGallery (images/videos)

### API Routes
- [ ] GET /api/posts/feed (personalized)
- [ ] POST /api/posts (create)
- [ ] GET /api/posts/[id] (single post)
- [ ] PUT /api/posts/[id] (edit)
- [ ] DELETE /api/posts/[id] (delete)
- [ ] POST /api/posts/[id]/reactions (react)
- [ ] DELETE /api/posts/[id]/reactions (remove)
- [ ] POST /api/posts/[id]/comments (comment)
- [ ] DELETE /api/posts/[id]/comments/[id] (delete comment)

### Hooks
- [ ] usePost(postId) - single post
- [ ] useFeedPosts(filters) - paginated feed
- [ ] useReactionsRealtime(postId) - live reaction counts

### Features
- Rich text with TipTap
- Visibility: public/team/private
- Reactions: like, fire, clap, trophy
- Comments with nesting
- Media upload
- Real-time reaction updates

**Estimated time:** 4-5 days

---

## PHASE 5: MESSAGING & WORKSPACE 📅

### Pages to Build
- [ ] /team/[slug]/workspace (channels + messages)

### Components
- [ ] ChannelSidebar (channel list)
- [ ] MessageList (paginated messages)
- [ ] MessageBubble (single message)
- [ ] MessageComposer (input + attachments)
- [ ] TypingIndicator (who's typing)
- [ ] OnlinePresence (active users)

### API Routes
- [ ] GET /api/teams/[id]/channels (list)
- [ ] POST /api/teams/[id]/channels (create)
- [ ] GET /api/channels/[id]/messages (paginated)
- [ ] POST /api/channels/[id]/messages (send)
- [ ] PATCH /api/messages/[id] (edit)
- [ ] DELETE /api/messages/[id] (delete)

### Hooks
- [ ] useRealtimeMessages(channelId) - Supabase Realtime
- [ ] useTypingIndicator(channelId) - Broadcast
- [ ] usePresence(teamId) - online status

### Features
- Real-time message delivery
- Typing indicators (Broadcast)
- Online presence per team
- Message edit/delete
- Thread replies
- Message search

**Estimated time:** 5-6 days

---

## PHASE 6: ORG CHART 📅

### Installation
```bash
npm install @xyflow/react dagre @dnd-kit/core @dnd-kit/sortable
```

### Pages to Build
- [ ] /team/[slug]/org-chart (interactive chart)

### Components
- [ ] OrgChart (React Flow canvas)
- [ ] OrgMemberNode (node with avatar + title)
- [ ] DepartmentLegend (color legend)

### API Routes
- [ ] GET /api/teams/[id]/org (nodes + edges)
- [ ] POST /api/teams/[id]/org (add member to chart)
- [ ] PATCH /api/teams/[id]/org/[nodeId] (update)

### Hooks
- [ ] useAutoLayout(nodes, edges) - Dagre layout

### Features
- Drag-and-drop nodes
- Auto-hierarchical layout with Dagre
- Department color coding
- Parent-child relationships
- Interactive node editing

**Estimated time:** 3-4 days

---

## PHASE 7: ROLES, TITLES & ACCESS 📅

### Pages to Build
- [ ] /admin (admin panel for superadmin only)
- [ ] /team/[slug]/settings (team admin)

### Components
- [ ] MemberRoleEditor (team_role select)
- [ ] TitleAssigner (title search + select)
- [ ] AccessLevelPicker (admin/member/readonly)
- [ ] DepartmentAssigner (dept select)

### API Routes
- [ ] PATCH /api/teams/[id]/members/[userId] (update role/title/dept/access)
- [ ] POST /api/admin/users (list all users)
- [ ] PATCH /api/admin/users/[id]/system-role (set system role)

### Features
- Three-layer access control:
  1. system_role on profiles (user/moderator/admin/superadmin)
  2. team_role on team_members (owner/captain/manager/player/viewer)
  3. access_level on team_members (admin/member/readonly)
- 45+ preset job titles
- Custom team titles
- Department assignment
- Permission matrix enforcement

**Estimated time:** 3-4 days

---

## PHASE 8: FANTASY SCORING 📅

### Supabase Edge Function
- [ ] Deploy weekly-scoring function
- [ ] Schedule cron: Monday 00:00 UTC

### Leaderboard Page
- [ ] /team/[slug]/leaderboard

### Components
- [ ] ScoreTable (member scores with Recharts)
- [ ] ScoreBreakdown (posts, reactions, messages)

### Features
- Weekly score calculation:
  - Posts: +3 points each
  - Reactions received: +1 point each
  - Messages: +0.1 point each (max 10/week)
- Auto-update stats on Monday
- Show contribution breakdown
- Historical scoring trends

**Estimated time:** 2-3 days

---

## PHASE 9: QA, SECURITY & DEPLOY 📅

### Testing
- [ ] Unit tests (Vitest) for:
  - Validation schemas
  - Service functions
  - Permission utilities
- [ ] E2E tests (Playwright):
  - Full auth flow
  - Team creation → invite → join
  - Message sending → receive
  - Org chart interactions
- [ ] Accessibility tests (axe-core)

### Security
- [ ] ESLint audit (no secrets in client)
- [ ] RLS policy audit (no bypasses)
- [ ] OAuth URL validation
- [ ] Rate limiting on API routes
- [ ] CSRF protection
- [ ] XSS prevention (Zod + DOMPurify)

### Deployment
- [ ] Sentry error tracking setup
- [ ] GitHub Actions CI/CD pipeline
- [ ] Netlify production deployment
- [ ] Smoke tests on live domain
- [ ] Domain SSL certificate

### Documentation
- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Troubleshooting

**Estimated time:** 4-5 days

---

## TOTAL PROJECT TIMELINE

| Phase | Focus | Days | Status |
|-------|-------|------|--------|
| 1 | Foundation | 2-3 | ✅ 95% |
| 2 | Profiles | 3-4 | 📅 |
| 3 | Teams | 5-6 | 📅 |
| 4 | Feed | 4-5 | 📅 |
| 5 | Messaging | 5-6 | 📅 |
| 6 | Org Chart | 3-4 | 📅 |
| 7 | Roles | 3-4 | 📅 |
| 8 | Scoring | 2-3 | 📅 |
| 9 | QA/Deploy | 4-5 | 📅 |
| **TOTAL** | **Full Application** | **34-42 days** | 📅 |

---

## Technology Stack Reference

### Frontend
- **Next.js 14** - App Router, SSR
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TanStack Query v5** - Data fetching
- **Zustand** - State management
- **TailwindCSS 3** - Styling
- **shadcn/ui** - Component library
- **React Hook Form** - Forms
- **Zod** - Validation
- **TipTap** - Rich text editor
- **React Flow** - Org chart
- **Dagre** - Graph layout
- **Framer Motion** - Animations

### Backend
- **Supabase** - Database, Auth, Storage, Realtime
- **PostgreSQL 15** - Database engine
- **Supabase Auth** - OAuth + email/password
- **Supabase Realtime** - WebSockets
- **Supabase Edge Functions** - Cron jobs
- **Supabase Storage** - File uploads
- **RLS Policies** - Authorization

### DevOps
- **Netlify** - Frontend hosting + serverless functions
- **GitHub Actions** - CI/CD
- **Playwright** - E2E testing
- **Vitest** - Unit testing
- **ESLint** - Linting
- **Prettier** - Formatting
- **Sentry** - Error tracking

---

## Key Design Decisions

1. **No Express Server** - Uses Supabase Realtime instead of Socket.io (serverless)
2. **No Passport.js** - Uses Supabase Auth (OAuth in 3 lines)
3. **No Custom RBAC** - Uses PostgreSQL RLS policies
4. **No S3/AWS** - Uses Supabase Storage
5. **No Redis** - Uses Upstash Redis for rate limiting
6. **No BullMQ** - Uses Supabase Edge Functions for cron
7. **Netlify, not AWS** - Serverless first architecture

---

## Files Created So Far (Phase 1)

```
Created:
✅ 9 database migrations (20260318000001-009)
✅ src/app/(auth)/login/page.tsx
✅ src/app/(auth)/register/page.tsx
✅ src/app/(auth)/forgot-password/page.tsx
✅ src/app/(auth)/auth/callback/route.ts
✅ src/app/(auth)/layout.tsx
✅ src/app/(dashboard)/dashboard/page.tsx
✅ src/app/(dashboard)/layout.tsx
✅ src/app/api/teams/route.ts
✅ src/app/api/users/me/route.ts
✅ src/app/api/users/search/route.ts
✅ src/lib/validations/team.schema.ts
✅ src/lib/validations/post.schema.ts
✅ src/lib/validations/invite.schema.ts
✅ src/lib/validations/profile.schema.ts
✅ src/lib/permissions.ts
✅ src/supabase-clients/client.ts (updated)
✅ src/supabase-clients/server.ts (updated)
✅ src/supabase-clients/middleware.ts (updated)
✅ middleware.ts (NEW)
✅ .env.local (template)
✅ TEAMGRID_PHASE1_SETUP.md (this file)
```

---

## How to Deploy/Run

```bash
# First time setup
npm install
cp .env.local.example .env.local
# (Fill in Supabase credentials)

# Apply migrations
supabase link --project-ref YOUR_REF
supabase db push

# Local development
pnpm dev
# Opens http://localhost:3000

# Run tests
pnpm test
pnpm test:e2e

# Build for production
pnpm build

# Deploy to Netlify
netlify deploy --prod
```

---

## Success Criteria by Phase

**Phase 1:** Email + 3x OAuth login works → /dashboard shows profile
**Phase 2:** Can search users by name/skills → view profiles
**Phase 3:** Create team → invite users → see roster
**Phase 4:** Post to feed → react → comment
**Phase 5:** Send messages in channels → see real-time updates
**Phase 6:** View interactive org chart → drag nodes
**Phase 7:** Change member roles → see permission changes
**Phase 8:** See member scores updated weekly
**Phase 9:** All tests pass → deploy to production

---

Last Updated: March 18, 2026
