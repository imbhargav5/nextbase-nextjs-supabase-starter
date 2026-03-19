# Scripts Directory

This directory contains utility scripts for database management and other development tasks.

## Database Migration Script

### `migrate.js`

A comprehensive database migration helper script that provides safe and user-friendly database operations.

#### Usage

```bash
# Push migrations to database
node scripts/migrate.js push

# Reset database (development only)
node scripts/migrate.js reset

# Check migration status
node scripts/migrate.js status
```

#### Features

- **Interactive confirmation** for destructive operations
- **Error handling** with detailed error messages
- **Progress logging** for each operation
- **Graceful interruption** handling (Ctrl+C)
- **TypeScript generation** after successful migrations

#### Commands

| Command | Description | Safety |
|---------|-------------|--------|
| `push` | Push migrations and generate types | Safe |
| `reset` | Reset database and re-push | ⚠️ Destructive |
| `status` | Show migration status | Safe |

#### Safety Features

- **Confirmation prompts** for destructive operations
- **Clear warnings** about data loss
- **Graceful error handling** with exit codes
- **Transaction safety** for complex operations

#### Integration

This script is integrated with the package.json scripts:

```json
{
  "scripts": {
    "db:migrate": "node scripts/migrate.js push",
    "db:migrate:reset": "node scripts/migrate.js reset"
  }
}
```

So you can also use:

```bash
pnpm db:migrate
pnpm db:migrate:reset
```

## Adding New Scripts

When adding new scripts to this directory:

1. **Create the script file** with appropriate shebang (`#!/usr/bin/env node`)
2. **Add documentation** to this README
3. **Consider adding npm script** aliases in package.json
4. **Test thoroughly** before using in production
5. **Handle errors gracefully** with appropriate exit codes

## Best Practices

- Always test scripts in development first
- Use confirmation prompts for destructive operations
- Provide clear, descriptive error messages
- Handle interruptions gracefully (Ctrl+C)
- Log progress and results clearly
- Use consistent exit codes (0 for success, non-zero for failure)