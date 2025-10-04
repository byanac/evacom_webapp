export function decodeToken(token: string) {
  if (!token) {
    return;
  }

  const _decodeToken = (token: string) => {
    try {
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      const jsonPayload = decodeURIComponent(
        Array.prototype.map.call(decoded, function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return;
    }
  };

  return token
    .split('.')
    .map(token => _decodeToken(token))
    .reduce((acc, curr) => {
      if (!!curr) acc = { ...acc, ...curr };
      return acc;
    }, Object.create(null));
}

export function isTokenValid(input: string | number): boolean {
  if (!input) {
    return false;
  }
  const exp = typeof input === 'string' ? decodeToken(input)['exp'] : input;
  return !!exp ? Math.floor(Date.now() / 1000) < exp : false;
}
