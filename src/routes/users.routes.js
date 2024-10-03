import { Router } from "express";
import {
  getUsers,
  //getUserById,
  getUserByWallet,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/index.controller.js";
import {pool} from '../db.js'

const router = Router();

router.get("/users", getUsers);
//router.get("/users/:id", getUserById);
router.get("/users/:direccion_wallet", getUserByWallet);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
