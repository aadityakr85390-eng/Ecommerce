import { requireSignIn, isAdmin } from "./authMiddleware.js";

export const requireAdmin = [requireSignIn, isAdmin];

