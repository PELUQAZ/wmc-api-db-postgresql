import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/index.controller.js";
import {pool} from '../db.js'

const router = Router();

router.get("/services", getServices);
router.get("/services/:id", getServiceById);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

export default router;
