import { render, screen, waitFor } from '@testing-library/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

// @ts-ignore - JavaScript auth module has no declaration file.
import { session } from '@/lib/api/auth';

import { WithAuth } from './with-auth';

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/api/auth', () => ({
  session: jest.fn(),
}));

const mockUseAtom = useAtom as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockSession = session as jest.Mock;

describe('WithAuth', () => {
  const replace = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    mockUseAtom.mockReturnValue([{ valid: false }]);
    mockUseRouter.mockReturnValue({
      pathname: '/service/mentalcare',
      replace,
    });
  });

  it('renders a protected page after a valid session is confirmed', async () => {
    mockSession.mockResolvedValue({
      data: { session: { user: { id: 'user-id' } } },
    });

    render(
      <WithAuth authPath="/membership/auth/login" locale="ko">
        <div>protected content</div>
      </WithAuth>
    );

    expect(await screen.findByText('protected content')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects a signed-out user without rendering protected content', async () => {
    mockSession.mockResolvedValue({ data: { session: null } });

    render(
      <WithAuth authPath="/membership/auth/login" locale="ko">
        <div>protected content</div>
      </WithAuth>
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(
        '/membership/auth/login',
        '/membership/auth/login',
        { locale: 'ko' }
      );
    });
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('initializes the session before rendering an auth callback route', async () => {
    let resolveSession: ((value: unknown) => void) | undefined;
    const pendingSession = new Promise((resolve) => {
      resolveSession = resolve;
    });
    mockSession.mockReturnValueOnce(pendingSession);

    const callbackProps = {
      authPath: '/membership/auth/login',
      locale: 'ko',
      requireAuth: false,
    };
    const callbackGuard = (
      <WithAuth {...callbackProps}>membership content</WithAuth>
    );

    render(callbackGuard);

    expect(screen.queryByText('membership content')).not.toBeInTheDocument();

    resolveSession?.({ data: { session: null } });

    expect(await screen.findByText('membership content')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
