import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export const encryptData = (data) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption failed", error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  try {
    if (!ciphertext || ciphertext === "undefined") return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};