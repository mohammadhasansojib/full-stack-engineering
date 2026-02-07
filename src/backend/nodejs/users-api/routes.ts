import express from "express"
import User from "./controllers"
import authMiddleware from "./authMiddleware"

const router = express.Router();

router.post("/login", User.login);
router.get("/profile", authMiddleware, User.profile);

router.get("/", authMiddleware, User.getUsers);
router.get("/:id", authMiddleware, User.getUserById);
router.post("/", authMiddleware, User.createUser);
router.delete("/:id", authMiddleware, User.deleteUser);
router.put("/:id", authMiddleware, User.updateUser);

export default router;