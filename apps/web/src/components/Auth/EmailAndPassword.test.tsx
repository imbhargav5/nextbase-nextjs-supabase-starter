import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { EmailAndPassword } from './EmailAndPassword';

afterEach(cleanup);

test('EmailAndPassword forwards button props to the submit button', () => {
  render(
    <EmailAndPassword
      isLoading
      onSubmit={() => {}}
      view="sign-in"
      className="max-w-xs"
      data-testid="login-submit"
    />
  );

  const submitButton = screen.getByTestId('login-submit');

  expect(submitButton.tagName).toBe('BUTTON');
  expect(submitButton).toHaveProperty('type', 'submit');
  expect(submitButton).toHaveProperty('disabled', true);
  expect(submitButton.className).toContain('w-full');
  expect(submitButton.className).toContain('max-w-xs');
});

test('EmailAndPassword renders the sign-up variant without the forgot-password link', () => {
  render(
    <EmailAndPassword
      isLoading={false}
      onSubmit={() => {}}
      view="sign-up"
    />
  );

  screen.getByRole('button', { name: 'Sign up' });
  expect(
    screen.queryByRole('link', { name: /forgot your password\?/i })
  ).toBeNull();
  expect(
    screen.getByRole('link', { name: /already have an account\? log in/i })
      .getAttribute('href')
  ).toBe('/login');
});
