import { createClient } from '@/supabase-clients/client';

export const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // limit each IP to 100 requests per windowMs
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxConcurrentSessions: 5,
};

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < SECURITY_CONFIG.passwordPolicy.minLength) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.passwordPolicy.minLength} characters long`);
  }

  if (SECURITY_CONFIG.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (SECURITY_CONFIG.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (SECURITY_CONFIG.passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (SECURITY_CONFIG.passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  if (password.toLowerCase().includes('password') || password.toLowerCase().includes('123456')) {
    errors.push('Password cannot contain common patterns');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potentially dangerous characters
    .replace(/['"]/g, '') // Remove quotes to prevent SQL injection
    .slice(0, 1000); // Limit length
}

export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const supabase = createClient();
  
  // Use current minute for grouping
  const currentMinute = new Date().toISOString().slice(0, 16);
  
  const { data, error } = await supabase
    .from('rate_limits')
    .select('id')
    .eq('identifier', identifier)
    .gte('created_at', new Date(Date.now() - SECURITY_CONFIG.rateLimit.windowMs).toISOString());

  if (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }

  if (data && data.length >= SECURITY_CONFIG.rateLimit.maxRequests) {
    return false;
  }

  // Record the request
  await supabase.from('rate_limits').insert({
    identifier,
    created_at: new Date().toISOString(),
  });

  return true;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
}

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}

export function validateUsername(username: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!username || typeof username !== 'string') {
    errors.push('Username is required');
    return { isValid: false, errors };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (trimmed.length > 50) {
    errors.push('Username cannot exceed 50 characters');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }
  
  // Check for reserved usernames
  const reserved = ['admin', 'root', 'system', 'null', 'undefined', 'api', 'www', 'mail', 'ftp'];
  if (reserved.includes(trimmed.toLowerCase())) {
    errors.push('Username is reserved');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isSafeRedirectUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const allowedHosts = [
      'localhost:3000',
      'yourdomain.com',
      'yourdomain.com'
    ];
    
    return allowedHosts.includes(urlObj.host);
  } catch {
    return false;
  }
}
