# Database Management Guide

This guide covers how to manage the TeamGrid v2 database using Supabase, including local development, migrations, and production deployment.

## 🗃️ Database Overview

TeamGrid v2 uses PostgreSQL with Supabase, featuring:

- **9 comprehensive migrations** covering core functionality
- **Row Level Security (RLS)** for data protection
- **Realtime capabilities** for live updates
- **TypeScript type generation** for type safety
- **OAuth authentication** with Google, GitHub, and LinkedIn

## 🚀 Quick Start

### Local Development

```bash
# Start local Supabase stack
pnpm db:local:start

# Start Next.js development server
pnpm dev

# Open http://localhost:54321 for Supabase Studio
# Open http://localhost:3000 for your application
```

### Production Deployment

```bash
# Push migrations to cloud
pnpm db:push

# Generate TypeScript types
pnpm db:types

# Build and deploy
pnpm build
netlify deploy --prod
```

## 📋 Available Commands

### Database Operations

| Command | Description | Usage |
|---------|-------------|-------|
| `pnpm db:push` | Push migrations to database | `pnpm db:push` |
| `pnpm db:pull` | Pull schema from cloud to local | `pnpm db:pull` |
| `pnpm db:reset` | Reset database (dev only) | `pnpm db:reset` |
| `pnpm db:seed` | Run seed scripts | `pnpm db:seed` |
| `pnpm db:status` | Check migration status | `pnpm db:status` |
| `pnpm db:types` | Generate TypeScript types | `pnpm db:types` |

### Local Development

| Command | Description | Usage |
|---------|-------------|-------|
| `pnpm db:local:start` | Start local Supabase stack | `pnpm db:local:start` |
| `pnpm db:local:stop` | Stop local Supabase stack | `pnpm db:local:stop` |

### Migration Helper

| Command | Description | Usage |
|---------|-------------|-------|
| `pnpm db:migrate` | Push migrations with confirmation | `pnpm db:migrate` |
| `pnpm db:migrate:reset` | Reset and re-push migrations | `pnpm db:migrate:reset` |

## 🔄 Migration Workflow

### Creating New Migrations

1. **Create migration file:**
   ```bash
   # Format: YYYYMMDDHHMMSS_description.sql
   touch supabase/migrations/20260318120000_add_new_feature.sql
   ```

2. **Write SQL migration:**
   ```sql
   -- Add your migration SQL here
   CREATE TABLE new_table (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Add rollback script (down migration):**
   ```sql
   -- Add rollback SQL here
   DROP TABLE IF EXISTS new_table;
   ```

4. **Push to database:**
   ```bash
   pnpm db:push
   ```

### Migration Best Practices

- ✅ **Always test migrations locally first**
- ✅ **Include rollback scripts**
- ✅ **Use transactions for complex migrations**
- ✅ **Add RLS policies for new tables**
- ✅ **Update TypeScript types after migration**
- ❌ **Never modify existing migration files**
- ❌ **Don't skip migration steps**
- ❌ **Don't push untested migrations to production**

### Example Migration

```sql
-- supabase/migrations/20260318120000_add_user_preferences.sql

-- Up migration
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Down migration
DROP TABLE IF EXISTS user_preferences;
```

## 🏗️ Database Structure

### Core Tables

- **`profiles`** - User profiles with extended auth data
- **`teams`** - Team information and metadata
- **`team_members`** - Team membership and roles
- **`team_invites`** - Team invitation system
- **`departments`** - Organizational departments
- **`titles`** - Job titles and roles
- **`org_nodes`** - Organizational chart structure

### Social Features

- **`posts`** - Team posts and announcements
- **`comments`** - Post comments
- **`reactions`** - Post reactions (likes, etc.)
- **`channels`** - Team communication channels
- **`messages`** - Channel messages
- **`notifications`** - User notifications

### Security & Access

- **Row Level Security (RLS)** enabled on all tables
- **OAuth authentication** via Supabase Auth
- **Service role keys** for server-side operations
- **Realtime subscriptions** with proper permissions

## 🔧 Environment Configuration

### Development Environment

Create `.env.development.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role
SUPABASE_PROJECT_REF=local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Environment

Create `.env.production.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role
SUPABASE_PROJECT_REF=your_production_ref
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🛡️ Security Best Practices

### Row Level Security (RLS)

All tables have RLS enabled with policies:

```sql
-- Example RLS policy
CREATE POLICY "Team members can view team data" ON team_members
  FOR ALL USING (is_team_member(team_id));
```

### Authentication

- Use `auth.uid()` for user identification
- Use `auth.role()` for role-based access
- Use service role keys only for server operations
- Never expose service role keys to client

### Data Validation

- Use Zod schemas for input validation
- Use PostgreSQL constraints for data integrity
- Use check constraints for enum validation
- Use foreign key constraints for relationships

## 🔄 Backup & Recovery

### Creating Backups

```bash
# Create backup
supabase db dump --output backup_$(date +%Y%m%d_%H%M%S).sql

# Create compressed backup
supabase db dump --output backup.sql | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restoring from Backup

```bash
# Restore from backup
supabase db restore --file backup_file.sql

# Restore from compressed backup
gunzip -c backup_file.sql.gz | supabase db restore
```

### Automated Backups

For production, consider setting up automated backups:

```bash
# Add to crontab for daily backups
0 2 * * * /usr/local/bin/supabase db dump --output /backups/teamgrid_$(date +\%Y\%m\%d).sql
```

## 🐛 Troubleshooting

### Common Issues

#### Migration Conflicts
```bash
# Check migration status
pnpm db:status

# Reset and start fresh (development only)
pnpm db:reset
pnpm db:push
```

#### Type Generation Issues
```bash
# Regenerate types
pnpm db:types

# Check if .env.local has correct credentials
cat .env.local
```

#### Local Development Issues
```bash
# Stop and restart local stack
pnpm db:local:stop
pnpm db:local:start

# Check if ports are in use
lsof -i :54321 -i :54322 -i :54323
```

#### Authentication Issues
```bash
# Check Supabase Auth settings
# Visit: http://localhost:54321/project/default/auth/settings

# Verify OAuth providers are configured
# Check redirect URLs match your setup
```

### Getting Help

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase CLI Reference**: https://supabase.com/docs/guides/cli
- **GitHub Issues**: Report bugs and feature requests
- **Discord**: https://discord.supabase.com

## 📊 Monitoring & Performance

### Database Monitoring

- Use Supabase Dashboard for real-time metrics
- Monitor query performance in SQL Editor
- Set up alerts for critical metrics
- Review connection pool usage

### Performance Optimization

- Use indexes on frequently queried columns
- Implement proper pagination for large datasets
- Use connection pooling for server operations
- Monitor and optimize slow queries

### Query Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_posts_team_id ON posts(team_id);
CREATE INDEX idx_messages_channel_id ON messages(channel_id);

-- Use proper pagination
SELECT * FROM posts 
WHERE team_id = 'team-id'
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All migrations tested locally
- [ ] RLS policies reviewed and tested
- [ ] TypeScript types regenerated
- [ ] Environment variables configured
- [ ] OAuth providers configured
- [ ] Backup strategy in place
- [ ] Monitoring and alerts set up
- [ ] Performance tested with realistic data

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Database Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)