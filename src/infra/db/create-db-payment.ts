// src/infra/db/create-db-payment.ts
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const connectionConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

const sqlCreateTables = `
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method ENUM('pix', 'credit_card') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_email VARCHAR(100) NOT NULL,
  card_encrypted_data TEXT,
  status ENUM('paid', 'partially_refunded', 'refunded') DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refunds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  refund_type ENUM('total', 'partial') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
`

export async function createTablesIfNotExists() {
  const connection = await mysql.createConnection(connectionConfig)
  try {
    await connection.query(sqlCreateTables)
    console.log('Tables created or already exist.')
  } catch (error) {
    console.error('Error creating tables:', error)
  } finally {
    await connection.end()
  }
}
