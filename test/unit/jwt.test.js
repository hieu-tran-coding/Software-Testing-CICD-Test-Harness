const { generateToken, verifyToken, JWT_SECRET } = require('../../src/utils/jwt');
const jwt = require('jsonwebtoken');

describe('Unit Tests: JWT Utility (src/utils/jwt.js)', () => {
  const samplePayload = {
    id: 'user_123',
    username: 'testuser',
    email: 'testuser@example.com'
  };

  test('1. generateToken should return a non-empty signed JWT string', () => {
    const token = generateToken(samplePayload);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // Header.Payload.Signature
  });

  test('2. generateToken should throw an error if payload is missing or invalid', () => {
    expect(() => generateToken(null)).toThrow('Payload must be a non-empty object');
    expect(() => generateToken('invalid-string')).toThrow('Payload must be a non-empty object');
  });

  test('3. verifyToken should successfully decode a valid token', () => {
    const token = generateToken(samplePayload);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(samplePayload.id);
    expect(decoded.username).toBe(samplePayload.username);
    expect(decoded.email).toBe(samplePayload.email);
    expect(decoded.exp).toBeDefined();
  });

  test('4. verifyToken should throw an error if token string is invalid or empty', () => {
    expect(() => verifyToken('')).toThrow('Token must be a valid non-empty string');
    expect(() => verifyToken(null)).toThrow('Token must be a valid non-empty string');
  });

  test('5. verifyToken should throw an error if token was tampered with or signed with wrong secret', () => {
    const fakeToken = jwt.sign(samplePayload, 'wrong-secret-key-12345');
    expect(() => verifyToken(fakeToken)).toThrow();
  });

  test('6. generateToken supports custom expiresIn duration', () => {
    const shortToken = generateToken(samplePayload, '1h');
    const decoded = verifyToken(shortToken);
    expect(decoded.id).toBe(samplePayload.id);
  });
});
