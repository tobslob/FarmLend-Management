import { compare, hash } from "bcrypt";

class PasswordService {
  /**
   * Generate a hash for the given password
   * @param password
   */
  async generateHash(password: string) {
    return await hash(password, 10);
  }

  /**
   * Confirm the password leads to the given hash
   * @param password password in pure strings
   * @param hashPassword hash of user password
   */
  async validate(password: string, hashPassword: string) {
    return await compare(password, hashPassword);
  }
}

export const Passwords = new PasswordService();
