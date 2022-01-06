import { Express } from "express";
import cors from "cors";
import { connectToDb } from "./lib/db";

export function startApp(app: Express) {
  connectToDb();

  app.use(cors);

  return app;
}
