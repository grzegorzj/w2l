import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'conversations.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conversation 
    ON messages(conversation_id, created_at);
`);

// Database operations
export const conversationDB = {
  // Create a new conversation
  create(title, code = '') {
    const stmt = db.prepare(`
      INSERT INTO conversations (title, code) 
      VALUES (?, ?)
    `);
    const info = stmt.run(title, code);
    return info.lastInsertRowid;
  },

  // Get all conversations (summary)
  getAll() {
    const stmt = db.prepare(`
      SELECT id, title, created_at, updated_at 
      FROM conversations 
      ORDER BY updated_at DESC
    `);
    return stmt.all();
  },

  // Get a specific conversation with messages
  getById(id) {
    const conversationStmt = db.prepare(`
      SELECT id, title, code, created_at, updated_at 
      FROM conversations 
      WHERE id = ?
    `);
    const conversation = conversationStmt.get(id);
    
    if (!conversation) return null;

    const messagesStmt = db.prepare(`
      SELECT id, role, content, created_at 
      FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `);
    const messages = messagesStmt.all(id);

    return {
      ...conversation,
      messages
    };
  },

  // Update conversation code
  updateCode(id, code) {
    const stmt = db.prepare(`
      UPDATE conversations 
      SET code = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(code, id);
  },

  // Update conversation title
  updateTitle(id, title) {
    const stmt = db.prepare(`
      UPDATE conversations 
      SET title = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(title, id);
  },

  // Delete a conversation
  delete(id) {
    const stmt = db.prepare('DELETE FROM conversations WHERE id = ?');
    stmt.run(id);
  },

  // Add a message to a conversation
  addMessage(conversationId, role, content) {
    const stmt = db.prepare(`
      INSERT INTO messages (conversation_id, role, content) 
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(conversationId, role, content);
    
    // Update conversation timestamp
    const updateStmt = db.prepare(`
      UPDATE conversations 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    updateStmt.run(conversationId);

    return info.lastInsertRowid;
  }
};

export default db;

