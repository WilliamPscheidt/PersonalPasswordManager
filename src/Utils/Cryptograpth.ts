import crypto from "crypto";

export class Cryptography {
    private static algorithm = 'aes-256-cbc';
    private static keyLength = 32;
    private static ivLength = 16;

    static Encrypt(masterKey: string, password: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const key = crypto.createHash('sha256').update(masterKey).digest();
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + '.' + encrypted;
    }

    static Decrypt(masterKey: string, encryptedData: string): string {
        const parts = encryptedData.split('.');
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedPassword = parts[1];

        const key = crypto.createHash('sha256').update(masterKey).digest();

        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}