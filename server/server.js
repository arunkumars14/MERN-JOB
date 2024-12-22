import './config/instrument.js'
import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhoos } from './controllers/webhooks.js';

const app = express();
await connectDB();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send("Api"))

app.post("/webhooks", clerkWebhoos)

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
