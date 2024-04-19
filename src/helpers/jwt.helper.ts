import jwt from 'jsonwebtoken';
const tokenExpiration = process.env.TOKEN_EXPIRATION;
const jwtSecret = process.env.JWT_SECRET;

export function createToken(tokenObj?: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(tokenObj, `${jwtSecret}`, { expiresIn: `${tokenExpiration}d` }, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

export function verifyToken(token?: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, `${jwtSecret}`, (err: any, decodedToken: any) => {
      if (err || !decodedToken) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}
