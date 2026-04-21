import { ApiException } from '../definitions/error';

describe('ApiException', () => {
  it('has correct statusCode and message', () => {
    const error = new ApiException(404, 'Not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
  });

  it('is instanceof Error', () => {
    const error = new ApiException(500, 'Server error');
    expect(error).toBeInstanceOf(Error);
  });

  it('is instanceof ApiException', () => {
    const error = new ApiException(401, 'Unauthorized');
    expect(error).toBeInstanceOf(ApiException);
  });

  it('has correct name', () => {
    const error = new ApiException(400, 'Bad request');
    expect(error.name).toBe('ApiException');
  });

  it('works in catch blocks with instanceof', () => {
    try {
      throw new ApiException(409, 'Conflict');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiException);
      if (e instanceof ApiException) {
        expect(e.statusCode).toBe(409);
      }
    }
  });
});
