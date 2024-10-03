import express, { NextFunction, Request, Response } from "express";
import utilityRoutes from "./routes/utility-routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/utils", utilityRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
