const pool = require("../config/db");
const redis = require("redis");
const client = redis.createClient();

client.connect().catch(console.error); // ✅ connect safely

const getGreeting = async (req, res) => {
  const userId = req.user?.userId;
  const hour = new Date().getHours();
  let category = "fallback";
  let userName = null;

  try {
    // ✅ Fetch user name
    const userResult = await pool.query(
      `SELECT name FROM cust_users WHERE user_id = $1`,
      [userId]
    );

    if (userResult.rowCount > 0) {
      userName = userResult.rows[0].name?.trim(); // remove spaces
      if (userName && userName.length > 0) {
        if (hour < 10) {
          category = "morning";
        } else if (hour < 12) {
          category = "mid-morning";
        } else {
          category = "generic";
        }
      } else {
        userName = null; // force null if empty
        category = "fallback"; // force fallback greetings
      }
    }

    // ✅ Check Redis cache first
    // const cached = await client.get(`greeting:${category}`);
    // if (cached) {
    //   const greeting = userName ? cached.replace("{name}", userName.split(" ")[0]) : cached;
    //   return res.json({ greeting });
    // }

    // ✅ Fallback to DB
    const result = await pool.query(
      `SELECT message FROM greetings WHERE category = $1 AND active = true`,
      [category]
    );

    if (result.rows.length === 0) {
      return res.json({ greeting: null });
    }

    const random = Math.floor(Math.random() * result.rows.length);
    const message = result.rows[random].message;

    // const finalGreeting = userName
    //   ? message.replace("{name}", userName.split(" ")[0])
    //   : message;
    const finalGreeting = message.replace(
      "{name}",
      userName ? userName.split(" ")[0] : "there"
    );

    // ✅ Cache it for 1 hour
    // await client.setEx(`greeting:${category}`, 3600, message);

    res.json({ greeting: finalGreeting });
  } catch (err) {
    console.error("Greeting fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch greeting" });
  }
};

module.exports = { getGreeting };
