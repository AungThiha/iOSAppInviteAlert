const crypto = require("crypto");

const encryptWithAes256Gcm = (encryptionKey, plaintext) => {
  if (encryptionKey.length !== 32) {
    throw new Error("Invalid key length. AES-256-GCM requires a 256-bit (32-byte) key.");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);

  const encryptedData =
    cipher.update(JSON.stringify(plaintext), "utf8", "base64") + cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64");

  return { encryptedData, iv: iv.toString("base64"), authTag };
}

module.exports = { encryptWithAes256Gcm };
