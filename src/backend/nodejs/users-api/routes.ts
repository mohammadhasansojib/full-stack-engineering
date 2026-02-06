import express from "express"
import User from "./controllers"

const router = express.Router();

router.get("/", User.getUsers);
router.get("/:id", User.getUserById);
router.post("/", User.createUser);
router.delete("/:id", User.deleteUser);
router.put("/:id", User.updateUser);

export default router;