import { requireSignIn, isAdmin } from "./authMidderware.js";

export const requireAdmin = [requireSignIn, isAdmin];

