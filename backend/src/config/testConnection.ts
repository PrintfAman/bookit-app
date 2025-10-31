import pool from "./database";

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful:", result.rows[0]);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await pool.end();
  }
}

testDB();