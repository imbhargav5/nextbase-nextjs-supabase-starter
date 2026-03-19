#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script helps set up the database for TeamGrid v2 development.
 * It guides users through the process of linking their Supabase project
 * and pushing the initial migrations.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function runCommand(cmd, description) {
  console.log(`\n${description}`);
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });
    console.log(`✅ ${description} completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(`Command: ${cmd}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function createEnvFile() {
  const envExamplePath = '.env.development.local.example';
  const envPath = '.env.development.local';

  if (!checkFileExists(envPath) && checkFileExists(envExamplePath)) {
    console.log('📝 Creating .env.development.local from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.development.local');
    console.log('⚠️  Please update the credentials in .env.development.local');
    return true;
  }
  return false;
}

async function main() {
  console.log('🚀 TeamGrid v2 Database Setup');
  console.log('================================\n');

  // Check if Supabase CLI is installed
  if (!runCommand('supabase --version', 'Checking Supabase CLI installation')) {
    console.log('❌ Please install Supabase CLI first:');
    console.log('   npm install -g supabase');
    process.exit(1);
  }

  // Create environment file if needed
  createEnvFile();

  console.log('📋 Setup Options:');
  console.log('1. Local Development (Start local Supabase stack)');
  console.log('2. Cloud Development (Link to existing Supabase project)');
  console.log('3. Production (Push to cloud and configure for production)');

  const choice = await askQuestion('\nChoose setup option (1-3): ');

  switch (choice) {
    case '1':
      console.log('\n🔧 Setting up Local Development Environment');
      console.log('===========================================');
      
      // Start local Supabase stack
      if (!runCommand('supabase start', 'Starting local Supabase stack')) {
        console.log('❌ Failed to start local Supabase stack');
        console.log('💡 Try running: pnpm db:local:stop && pnpm db:local:start');
        process.exit(1);
      }

      // Push migrations to local database
      if (!runCommand('supabase db push', 'Pushing migrations to local database')) {
        console.log('❌ Failed to push migrations');
        process.exit(1);
      }

      // Generate TypeScript types
      if (!runCommand('pnpm db:types', 'Generating TypeScript types')) {
        console.log('❌ Failed to generate TypeScript types');
        process.exit(1);
      }

      console.log('🎉 Local development setup complete!');
      console.log('\nNext steps:');
      console.log('1. Update .env.development.local with your credentials');
      console.log('2. Start your development server: pnpm dev');
      console.log('3. Open Supabase Studio: http://localhost:54321');
      console.log('4. Open your app: http://localhost:3000');
      break;

    case '2':
      console.log('\n☁️  Setting up Cloud Development Environment');
      console.log('============================================');
      
      const projectRef = await askQuestion('Enter your Supabase Project Ref: ');
      
      if (!projectRef) {
        console.log('❌ Project Ref is required');
        process.exit(1);
      }

      // Link project
      if (!runCommand(`supabase link --project-ref ${projectRef}`, 'Linking to Supabase project')) {
        console.log('❌ Failed to link to Supabase project');
        console.log('💡 Make sure you have the correct Project Ref and are logged in');
        process.exit(1);
      }

      // Push migrations to cloud
      if (!runCommand('supabase db push', 'Pushing migrations to cloud database')) {
        console.log('❌ Failed to push migrations to cloud');
        process.exit(1);
      }

      // Generate TypeScript types
      if (!runCommand('pnpm db:types', 'Generating TypeScript types')) {
        console.log('❌ Failed to generate TypeScript types');
        process.exit(1);
      }

      console.log('🎉 Cloud development setup complete!');
      console.log('\nNext steps:');
      console.log('1. Update .env.development.local with your Supabase credentials');
      console.log('2. Configure OAuth providers in Supabase Dashboard');
      console.log('3. Start your development server: pnpm dev');
      console.log('4. Open Supabase Dashboard: https://app.supabase.com/project/' + projectRef);
      break;

    case '3':
      console.log('\n🏭 Setting up Production Environment');
      console.log('=====================================');
      
      const prodProjectRef = await askQuestion('Enter your Production Supabase Project Ref: ');
      
      if (!prodProjectRef) {
        console.log('❌ Production Project Ref is required');
        process.exit(1);
      }

      // Link to production project
      if (!runCommand(`supabase link --project-ref ${prodProjectRef}`, 'Linking to production Supabase project')) {
        console.log('❌ Failed to link to production project');
        process.exit(1);
      }

      // Push migrations to production
      console.log('⚠️  This will push migrations to your PRODUCTION database!');
      const confirmProd = await askQuestion('Are you sure you want to continue? (yes/no): ');
      
      if (confirmProd.toLowerCase() !== 'yes') {
        console.log('❌ Production setup cancelled');
        process.exit(0);
      }

      if (!runCommand('supabase db push', 'Pushing migrations to production database')) {
        console.log('❌ Failed to push migrations to production');
        process.exit(1);
      }

      // Generate TypeScript types
      if (!runCommand('pnpm db:types', 'Generating TypeScript types')) {
        console.log('❌ Failed to generate TypeScript types');
        process.exit(1);
      }

      console.log('🎉 Production setup complete!');
      console.log('\nNext steps:');
      console.log('1. Update .env.production.local with your production credentials');
      console.log('2. Configure OAuth providers in Supabase Dashboard');
      console.log('3. Build and deploy: pnpm build && netlify deploy --prod');
      console.log('4. Monitor your production database in Supabase Dashboard');
      break;

    default:
      console.log('❌ Invalid option. Please choose 1, 2, or 3.');
      process.exit(1);
  }

  console.log('\n📚 Additional Resources:');
  console.log('- Database Documentation: DATABASE.md');
  console.log('- Supabase CLI Docs: https://supabase.com/docs/guides/cli');
  console.log('- TeamGrid Roadmap: TEAMGRID_ROADMAP.md');

  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nSetup script interrupted');
  rl.close();
  process.exit(0);
});

main().catch(async (error) => {
  console.error('❌ Setup script failed:', error.message);
  rl.close();
  process.exit(1);
});