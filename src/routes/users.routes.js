import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserByWallet,
  createUser,
  //updateUser,
  updateUserByWallet,
  deleteUser,
} from "../controllers/index.users.controller.js";
import {pool} from '../db.js'

const router = Router();

router.get("/users", getUsers);
router.get("/users/id/:id", getUserById); // Buscar por ID
router.get("/users/wallet/:wallet", getUserByWallet); // Buscar por wallet
router.post("/users", createUser);
//router.put("/users/:id", updateUser);
router.put("/users/:wallet", updateUserByWallet);
router.delete("/users/:id", deleteUser);

export default router;

