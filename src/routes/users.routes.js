import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/index.controller.js";
import {pool} from '../db.js'

const router = Router();

router.get("/users", async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios_wmc');
  console.log(result);
  res.send('Obteniendo usuarios');
});
//router.get("/users", getUsers);

router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
