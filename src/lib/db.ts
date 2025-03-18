
// Mock database for browser environment
// In a real application, this would be handled by API calls to a backend server

// In-memory storage for users
const users: any[] = [];

// Function to execute database queries (mock implementation for browser)
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  console.log('Mock DB Query:', query, params);
  
  // Simulate user operations
  if (query.includes('CREATE TABLE IF NOT EXISTS users')) {
    console.log('Initialized users table');
    return [] as unknown as T;
  }
  
  if (query.includes('INSERT INTO users')) {
    const [name, email, password] = params;
    const id = users.length + 1;
    const created_at = new Date().toISOString();
    const user = { id, name, email, password, created_at };
    users.push(user);
    return { insertId: id } as unknown as T;
  }
  
  if (query.includes('SELECT * FROM users WHERE email')) {
    const [email] = params;
    const user = users.find(u => u.email === email);
    return user ? [user] as unknown as T : [] as unknown as T;
  }
  
  if (query.includes('SELECT id, name, email, created_at FROM users WHERE id')) {
    const [id] = params;
    const user = users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return [userWithoutPassword] as unknown as T;
    }
    return [] as unknown as T;
  }
  
  return [] as unknown as T;
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist (mock implementation)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Mock database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mock database:', error);
  }
}
