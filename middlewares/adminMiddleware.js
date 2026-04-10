import { requireSignIn, isAdmin } from "./authMiddlerware.js";

export const requireAdmin = [requireSignIn, isAdmin];

