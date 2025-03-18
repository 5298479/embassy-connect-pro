
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  firstName: string;
  lastName: string;
}

// Register a new user
export async function registerUser(userData: RegisterData): Promise<User | null> {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Insert the user into the database
    const result = await executeQuery<any>(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [userData.firstName, userData.lastName, userData.email, hashedPassword]
    );
    
    if (result.insertId) {
      // Fetch and return the created user (without password)
      const users = await executeQuery<User[]>(
        'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?',
        [result.insertId]
      );
      return users[0] || null;
    }
    return null;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login user
export async function loginUser(credentials: UserCredentials): Promise<User | null> {
  try {
    // Find user by email
    const users = await executeQuery<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [credentials.email]
    );
    
    const user = users[0];
    
    // If user not found or password doesn't match
    if (!user || !(await bcrypt.compare(credentials.password, user.password_hash))) {
      return null;
    }
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
