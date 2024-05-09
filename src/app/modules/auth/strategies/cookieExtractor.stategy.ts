export function cookieExtractor(req: any): string | null {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['sessionToken'];
  }
  return token;
}
