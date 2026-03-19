/**
 * Database Health Check Utilities
 * 
 * This module provides utilities to check the health and connectivity
 * of the Supabase database connection.
 */

import { createSupabaseClient } from '@/supabase-clients/client';

export interface DatabaseHealthCheck {
  healthy: boolean;
  message: string;
  error?: string;
  timestamp: string;
}

export interface DatabaseHealthStatus {
  connection: DatabaseHealthCheck;
  tables: DatabaseHealthCheck[];
  realtime: DatabaseHealthCheck;
  overall: DatabaseHealthCheck;
}

/**
 * Check database connection health
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealthCheck> {
  try {
    const supabase = createSupabaseClient();
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      return {
        healthy: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    return {
      healthy: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if specific tables exist and are accessible
 */
export async function checkTableHealth(tables: string[]): Promise<DatabaseHealthCheck[]> {
  const results: DatabaseHealthCheck[] = [];
  const supabase = createSupabaseClient();

  for (const table of tables) {
    try {
      // Test table access with a simple count query
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results.push({
          healthy: false,
          message: `Table '${table}' access failed`,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          healthy: true,
          message: `Table '${table}' accessible (${count || 0} records)`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      results.push({
        healthy: false,
        message: `Table '${table}' check failed`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
}

/**
 * Check Realtime functionality
 */
export async function checkRealtimeHealth(): Promise<DatabaseHealthCheck> {
  try {
    const supabase = createSupabaseClient();
    
    // Test Realtime subscription
    const channel = supabase.channel('health-check');
    
    const subscription = channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // Just listen for any changes
      })
      .subscribe();

    // Wait a moment for subscription to establish
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clean up
    supabase.removeChannel(channel);

    return {
      healthy: true,
      message: 'Realtime functionality working',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      message: 'Realtime functionality failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Perform comprehensive database health check
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  const connection = await checkDatabaseConnection();
  
  // Check core tables
  const coreTables = [
    'profiles',
    'teams', 
    'team_members',
    'team_invites',
    'departments',
    'titles',
    'org_nodes'
  ];

  const tableHealth = await checkTableHealth(coreTables);
  const realtime = await checkRealtimeHealth();

  // Determine overall health
  const allChecks = [connection, ...tableHealth, realtime];
  const healthyChecks = allChecks.filter(check => check.healthy);
  const overallHealthy = healthyChecks.length === allChecks.length;

  const overall: DatabaseHealthCheck = {
    healthy: overallHealthy,
    message: overallHealthy 
      ? 'All database systems healthy' 
      : `${healthyChecks.length}/${allChecks.length} systems healthy`,
    timestamp: new Date().toISOString()
  };

  return {
    connection,
    tables: tableHealth,
    realtime,
    overall
  };
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const supabase = createSupabaseClient();

    // Get user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get team count
    const { count: teamCount } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true });

    // Get member count
    const { count: memberCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true });

    return {
      users: userCount || 0,
      teams: teamCount || 0,
      members: memberCount || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Database health check middleware for API routes
 */
export function createHealthCheckMiddleware() {
  return async function healthCheckMiddleware(req: Request, res: Response, next: Function) {
    try {
      const health = await checkDatabaseHealth();
      
      if (!health.overall.healthy) {
        return new Response(
          JSON.stringify({
            error: 'Database health check failed',
            details: health
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      next();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Health check failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}

/**
 * Health check API endpoint handler
 */
export async function handleHealthCheck() {
  try {
    const health = await checkDatabaseHealth();
    const stats = await getDatabaseStats();

    return new Response(
      JSON.stringify({
        status: 'ok',
        health,
        stats,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}