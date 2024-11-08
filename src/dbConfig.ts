import sql from "mssql";

const config: sql.config = {
  user: process.env.RPAUSER,
  password: process.env.RPAPASSWORD,
  server: "corpsqlserveruat.database.windows.net",
  database: process.env.RPADATABASE,
  options: {
    encrypt: true,
  },
};
const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => {
    console.log("Database Connection Failed! Bad Config:", err);
    throw new Error("Database connection failed");
  });
export { sql, poolPromise };
