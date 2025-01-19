const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Token Required');

  const accessToken = token.split(' ')[1];
  console.log('Access Token:', accessToken);

  jwt.verify(
    accessToken,
    jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksUri: 'http://localhost:8080/realms/FileManagerRealm/protocol/openid-connect/certs',
    }),
    {
      audience: 'file-manager-app',
      issuer: 'http://localhost:8080/realms/FileManagerRealm',
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) return res.status(403).send('Invalid Token');
      req.user = decoded;
      next();
    }
  );
};

module.exports = authenticateToken;
