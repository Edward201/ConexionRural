import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, type User, type InsertUser, type SafeUser } from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<SafeUser>;
  updateUser(id: number, data: Partial<User>): Promise<SafeUser | undefined>;
  getAllUsers(): Promise<SafeUser[]>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

/**
 * A class that implements the IStorage interface using a database.
 */
export class DatabaseStorage implements IStorage {
  /**
   * Gets a user by their ID.
   * @param {number} id - The ID of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Gets a user by their username.
   * @param {string} username - The username of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  /**
   * Gets a user by their email.
   * @param {string} email - The email of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  /**
   * Creates a new user.
   * @param {InsertUser} insertUser - The user to create.
   * @returns {Promise<SafeUser>} The created user, without the password.
   */
  async createUser(insertUser: InsertUser): Promise<SafeUser> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);

    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();

    // Return the user without the password
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Updates a user.
   * @param {number} id - The ID of the user to update.
   * @param {Partial<User>} data - The data to update.
   * @returns {Promise<SafeUser | undefined>} The updated user, or undefined if not found.
   */
  async updateUser(id: number, data: Partial<User>): Promise<SafeUser | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!updated) return undefined;

    const { password, ...safeUser } = updated;
    return safeUser;
  }

  /**
   * Gets all users.
   * @returns {Promise<SafeUser[]>} All users, without their passwords.
   */
  async getAllUsers(): Promise<SafeUser[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(({ password, ...user }) => user);
  }

  /**
   * Verifies a password.
   * @param {string} plainPassword - The plain password to verify.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @returns {Promise<boolean>} Whether the password is valid.
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const storage = new DatabaseStorage();
