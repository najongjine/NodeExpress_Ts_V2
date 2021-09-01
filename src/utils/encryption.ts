const crypto = require('crypto-js');
const { configSettings } = require('../config/settings');

let txtEncrypt = (strData: string) => {
  let ciphertext = crypto.AES.encrypt(
    strData,
    configSettings.cryptoKey,
  ).toString();
  let base64EncodedText = Buffer.from(ciphertext, 'utf8').toString('base64');
  return base64EncodedText;
};
let txtDecrypt = (strData: string) => {
  let base64DecodedText = Buffer.from(strData, 'base64').toString('utf8');
  let bytes = crypto.AES.decrypt(base64DecodedText, configSettings.cryptoKey);
  let originalText = bytes.toString(crypto.enc.Utf8);
  return originalText;
};
let objEncrypt = (objData: Object) => {
  let ciphertext = crypto.AES.encrypt(
    JSON.stringify(objData),
    configSettings.cryptoKey,
  ).toString();
  let base64EncodedText = Buffer.from(ciphertext, 'utf8').toString('base64');
  return base64EncodedText;
};
let objDecrypt = (strData: string) => {
  let base64DecodedText = Buffer.from(strData, 'base64').toString('utf8');
  let bytes = crypto.AES.decrypt(base64DecodedText, configSettings.cryptoKey);
  let decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
  return decryptedData;
};
let encryption = { txtEncrypt, txtDecrypt, objEncrypt, objDecrypt };
export default encryption;
