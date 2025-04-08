import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import { initRoutes } from "./interfaces/api/routes";
import * as dotenv from "dotenv";
import { logger } from "./shared/logger";
dotenv.config(); // 👈 cargamos variables de entorno

const app = express();

app.use(cors());
app.use(express.json());

initRoutes(app);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Inventory Service running on port ${PORT}`);
      logger.info(`🚀 Inventory Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error al iniciar conexión TypeORM", err);
    console.error("Error al iniciar conexión TypeORM", err);
  });
