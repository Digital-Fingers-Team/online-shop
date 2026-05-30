import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connect.js";

await connectDatabase();
app.listen(env.PORT, () => console.log(`Marketplace API listening on ${env.PORT}`));
