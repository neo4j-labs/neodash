import CryptoJS from 'crypto-js';

const secretKey = 'nosecret';
export const encryptString = (input) => {
  const encrypted = CryptoJS.AES.encrypt(input, secretKey).toString();
  return encrypted;
};

export const decryptString = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
