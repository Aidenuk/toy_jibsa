import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
//when this url requested, check middelware which is verifyToken if everything is satisfied then next() running the next
router.get("/should-be-logged-in",verifyToken,shouldBeLoggedIn);

router.get("/should-be-admin",shouldBeAdmin);

export default router;