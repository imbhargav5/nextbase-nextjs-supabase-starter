#!/usr/bin/env node

/**
 * Database Migration Helper Script
 * 
 * Usage:
 *   node scripts/migrate.js [command]
 * 
 * Commands:
 *   push    - Push migrations to database and generate types
 *   reset   - Reset database (development only) and re-push migrations
 *   status  - Show migration status
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

function runCommand(cmd, description) {
  console.log(`\n${description}`);
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });
    console.log(`✅ ${description} completed successfully\n`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(`Command: ${cmd}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];

  if (!command) {
    console.log('Usage: node scripts/migrate.js [push|reset|status]');
    console.log('\nCommands:');
    console.log('  push    - Push migrations to database and generate types');
    console.log('  reset   - Reset database (development only) and re-push migrations');
    console.log('  status  - Show migration status');
    process.exit(1);
  }

  switch (command) {
    case 'push':
      console.log('🚀 Pushing migrations to database...');
      runCommand('supabase db push', 'Pushing migrations to Supabase');
      runCommand('pnpm db:types', 'Generating TypeScript types');
      console.log('🎉 Migration push completed successfully!');
      break;

    case 'reset':
      console.log('⚠️  Database Reset Warning');
      console.log('This will DELETE ALL DATA in your database!');
      console.log('This action is IRREVERSIBLE and should ONLY be used in development.');
      
      const confirmed = await askQuestion('\nAre you sure you want to continue? (y/N): ');
      
      if (!confirmed) {
        console.log('❌ Database reset cancelled');
        process.exit(0);
      }

      console.log('\n🔄 Resetting database...');
      runCommand('supabase db reset', 'Resetting database');
      runCommand('supabase db push', 'Pushing migrations after reset');
      runCommand('pnpm db:types', 'Generating TypeScript types');
      console.log('🎉 Database reset and migration completed successfully!');
      break;

    case 'status':
      console.log('📊 Checking migration status...');
      runCommand('supabase db status', 'Checking migration status');
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('Available commands: push, reset, status');
      process.exit(1);
  }

  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nMigration script interrupted');
  rl.close();
  process.exit(0);
});

main().catch(async (error) => {
  console.error('❌ Migration script failed:', error.message);
  rl.close();
  process.exit(1);
});