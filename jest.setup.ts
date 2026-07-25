import '@testing-library/jest-dom';

if (typeof global.fetch === 'undefined') {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ ip: '127.0.0.1' }),
    })
  );
}
