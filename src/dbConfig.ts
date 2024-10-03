import sql from "mssql";

const config: sql.config = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  server: "corpsqlserverprod.database.windows.net",
  database: process.env.DATABASE,
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
    // Either re-throw the error or handle it appropriately here.
    // For example, you could throw a custom error:
    throw new Error("Database connection failed");
  });
export { sql, poolPromise };
