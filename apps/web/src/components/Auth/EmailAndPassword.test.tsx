import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { EmailAndPassword } from './EmailAndPassword';

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
