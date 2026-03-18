import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
  channel: vi.fn(() => ({
    on: vi.fn(() => ({
      subscribe: vi.fn(() => ({
        unsubscribe: vi.fn(),
      })),
    })),
    subscribe: vi.fn(),
    send: vi.fn(),
    presenceState: vi.fn(() => ({})),
    track: vi.fn(),
  })),
  removeChannel: vi.fn(),
};

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.png',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockTeam = (overrides = {}) => ({
  id: 'team-1',
  name: 'Test Team',
  description: 'A test team',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockTeamMember = (overrides = {}) => ({
  id: 'member-1',
  user_id: 'user-1',
  team_id: 'team-1',
  role: 'member',
  joined_at: new Date().toISOString(),
  messages_sent: 5,
  reactions_given: 3,
  reactions_received: 2,
  posts_created: 1,
  comments_made: 2,
  tasks_completed: 0,
  ...overrides,
});

export const setupMockRouter = (overrides = {}) => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    ...overrides,
  };
  
  vi.mocked(useRouter).mockReturnValue(mockRouter);
  return mockRouter;
};

export const waitForLoadingToFinish = () =>
  waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

export const user = userEvent.setup();