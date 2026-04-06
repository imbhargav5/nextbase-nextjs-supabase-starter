import { execSync } from 'node:child_process';

const supabaseStatus = execSync('cd apps/database && supabase status', {
  encoding: 'utf-8',
  stdio: ['pipe', 'pipe', 'pipe'],
});

console.log('Supabase status:', supabaseStatus);
