import { Express } from "express";
import { postNotification } from "./controllers/NotificationController";
import { getInventory } from "./controllers/InventoryController";
import { getSyncControl } from "./controllers/SyncControlController";
import { apiKeyAuth } from "../../shared/middlewares/apiKeyAuth";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

export function initRoutes(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.post("/notifications", apiKeyAuth, postNotification);

  app.get("/health-check", (req, res) => {
    res.status(200).json({
      status: "ok",
      message: "Inventory Service is running",
    });
  });

  // Inventory
  app.get("/inventory/product", apiKeyAuth, getInventory);
  app.get("/inventory", apiKeyAuth, getInventory);
  app.get("/sync-control", apiKeyAuth, getSyncControl);
  app.post("/sapo-inventory", apiKeyAuth, postNotification);
}
