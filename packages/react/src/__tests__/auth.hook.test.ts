const mockCall = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (fn: unknown) => fn,
  useMemo: (factory: () => unknown) => factory(),
}));

jest.mock('../hooks/api.hook', () => ({
  useApi: () => ({ call: mockCall }),
}));

import { useAuth } from '../hooks/auth.hook';

describe('useAuth', () => {
  beforeEach(() => {
    mockCall.mockReset();
  });

  it('requests a mail login code without an authentication token', async () => {
    mockCall.mockResolvedValue({ secret: 'mail-login-secret' });

    const auth = useAuth();

    await expect(
      auth.requestMailLoginCode('user@example.com', 'https://example.com/redirect', 'recommendation', 'wallet'),
    ).resolves.toEqual({ secret: 'mail-login-secret' });
    expect(mockCall).toHaveBeenCalledWith({
      url: 'auth/mail',
      method: 'POST',
      data: {
        mail: 'user@example.com',
        redirectUri: 'https://example.com/redirect',
        recommendationCode: 'recommendation',
        wallet: 'wallet',
        withCode: true,
      },
      token: false,
    });
  });

  it('signs in with a mail code without an authentication token', async () => {
    mockCall.mockResolvedValue({ accessToken: 'access-token' });

    const auth = useAuth();

    await expect(auth.signInWithMailCode('mail-login-secret', '123456')).resolves.toEqual({
      accessToken: 'access-token',
    });
    expect(mockCall).toHaveBeenCalledWith({
      url: 'auth/mail/code',
      method: 'POST',
      data: { secret: 'mail-login-secret', code: '123456' },
      token: false,
    });
  });
});
