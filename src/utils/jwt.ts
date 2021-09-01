import encryption from '../utils/encryption';
const { configSettings } = require('../config/settings');
const jwt = require('jsonwebtoken');

/** "2 days", "10h", "7d", 1h, 1m */
let signJwt = (payload: Object) => {
  let encPaylod = encryption.objEncrypt(payload);
  const token = jwt.sign({ payload: encPaylod }, configSettings.jwtKey, {
    expiresIn: '30d',
    issuer: 'jong',
    audience: 'client',
  });
  return token;
};

let verifyToken = (token: Object) => {
  /** ## encPaylod:  {
  payload: 'VTJGc2RHVmtYMStTeWh0eHNCWWEvVGJlWmFDUTRmb1RpckNnNzV0RytNdz0=',
  iat: 1630386640,
  exp: 1632978640,
  aud: 'client',
  iss: 'jong'
} */
  let encPaylod = jwt.verify(token, configSettings.jwtKey);
  let payload = encryption.objDecrypt(encPaylod.payload);
  return payload;
};

let jwtVerification = { signJwt, verifyToken };
export default jwtVerification;
