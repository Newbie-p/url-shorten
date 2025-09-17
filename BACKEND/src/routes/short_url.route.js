import express from "express";
import { createShortUrl, listMyUrls, deleteUrl } from "../controller/short_url.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../utils/auth.js";
const router = express.Router();

// If a user is logged in, attach userId to created URL via controller/service
router.post("/", optionalAuthMiddleware, createShortUrl)
router.get("/me", authMiddleware, listMyUrls)
router.delete("/:id", authMiddleware, deleteUrl)

export default router;