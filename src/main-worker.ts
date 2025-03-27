import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

import { emitPendingEvents } from "./app/EmitPendingEvents";

dotenv.config();

(async () => {
  await AppDataSource.initialize();

  await emitPendingEvents();
})();
