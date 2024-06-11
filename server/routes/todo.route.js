import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getTodos,postTodo,updateTodo,deleteTodo } from "../controllers/todo.controller.js";


const router = express.Router();

router.get("/:id",verifyToken,getTodos);
router.post("/:id",verifyToken,postTodo);
router.put("/:id",verifyToken,updateTodo);
router.delete("/:id",verifyToken,deleteTodo);

export default router;