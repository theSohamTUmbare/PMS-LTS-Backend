import { Pool } from "pg";
import "dotenv/config";

console.log(process.env.DATABASE_URL);  // Test this to ensure the variable is loaded

const db = new Pool({
    // connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false,  // Allow unverified SSL connection
},
});

db.on('connect', () => {
    console.log('Connected to database');
});

export default db;

