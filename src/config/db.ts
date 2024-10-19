import { Pool } from "pg";
import "dotenv/config";

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.on('connect', () => {
    console.log('Connected to database');
});

export default db;