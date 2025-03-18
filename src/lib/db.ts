
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: 'sql7.freesqldatabase.com',
  database: 'sql7765573',
  user: 'sql7765573',
  password: '3nHjT6K1VI',
  port: 3306
};

// Create a connection pool
let pool: mysql.Pool;

// Initialize the connection pool
const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Function to execute database queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const connection = await getPool().getConnection();
    try {
      const [results] = await connection.execute(query, params);
      return results as unknown as T;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    
    // For browser environments during development, fall back to mock implementation
    if (typeof window !== 'undefined') {
      console.warn('Falling back to mock database in browser environment');
      return mockExecuteQuery(query, params);
    }
    
    throw error;
  }
}

// Mock in-memory storage for users in browser environment
const users: any[] = [];

// Mock implementation for browser testing
function mockExecuteQuery<T>(query: string, params: any[] = []): T {
  console.log('Mock DB Query:', query, params);
  
  // Simulate user operations
  if (query.includes('CREATE TABLE IF NOT EXISTS users')) {
    console.log('Initialized users table');
    return [] as unknown as T;
  }
  
  if (query.includes('INSERT INTO users')) {
    const [firstName, lastName, email, passwordHash] = params;
    const id = users.length + 1;
    const created_at = new Date().toISOString();
    const user = { 
      id, 
      first_name: firstName, 
      last_name: lastName, 
      email, 
      password_hash: passwordHash, 
      created_at 
    };
    users.push(user);
    return { insertId: id } as unknown as T;
  }
  
  if (query.includes('SELECT * FROM users WHERE email')) {
    const [email] = params;
    const user = users.find(u => u.email === email);
    return user ? [user] as unknown as T : [] as unknown as T;
  }
  
  if (query.includes('SELECT id, first_name, last_name, email, created_at FROM users WHERE id')) {
    const [id] = params;
    const user = users.find(u => u.id === id);
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return [userWithoutPassword] as unknown as T;
    }
    return [] as unknown as T;
  }
  
  return [] as unknown as T;
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
