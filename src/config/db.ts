import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;
const db = new Pool({
  host: PGHOST as string,
  database: PGDATABASE as string,
  user: PGUSER as string,
  password: PGPASSWORD as string,
  port: parseInt(PGPORT as string, 10) || 5432,
  ssl:{
    rejectUnauthorized: true,
  }
  
});

// Listen for the connect event
db.on('connect', () => {
    console.log('Connected to database');
});

// Listen for error events
db.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Force a connection attempt
db.query('SELECT 1')
.then(() => console.log("Connection test query executed"))
.catch((err) => console.error("Connection test query failed:", err));

export default db;