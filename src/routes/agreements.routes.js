import { Router } from "express";
import {
  getAgreements,
  createAgreement,
  //getAgreementById,
  getAgreementsByWallet
  //getServicesBySPA,
  //getServicesBySPR,
  //updateAgreement
} from "../controllers/index.agreements.controller.js";
import {pool} from '../db.js'

const router = Router();

router.get("/agreements", getAgreements);
router.post("/agreements", createAgreement);
//router.get("/agreements/spa/:id", getAgreementById);
router.get("/agreements/:wallet", getAgreementsByWallet);
//router.get("/agreements/:id", getAgreementBySPA);
//router.get("/agreements/:id", getAgreementBySPR);
export default router;
