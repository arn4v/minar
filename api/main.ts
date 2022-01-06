import { config as dotenv } from "dotenv";
import express from "express";
import { startApp } from "./start-app";

dotenv();

const app = express();

startApp(app);

export const handler = app;
