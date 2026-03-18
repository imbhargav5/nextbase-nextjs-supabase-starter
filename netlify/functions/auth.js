import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handler(event, context) {
  try {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      };
    }

    const { method, body } = event;

    switch (method) {
      case 'POST': {
        const { email, password, action } = JSON.parse(body);

        if (action === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            return {
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
              body: JSON.stringify({ error: error.message }),
            };
          }

          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'User created successfully', data }),
          };
        }

        if (action === 'signin') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return {
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
              body: JSON.stringify({ error: error.message }),
            };
          }

          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'User signed in successfully', data }),
          };
        }

        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Invalid action' }),
        };
      }

      case 'GET': {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          return {
            statusCode: 401,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: error.message }),
          };
        }

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ user: data.user }),
        };
      }

      case 'DELETE': {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: error.message }),
          };
        }

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: 'User signed out successfully' }),
        };
      }

      default:
        return {
          statusCode: 405,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}