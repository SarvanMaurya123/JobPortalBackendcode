import { Router } from "express";
import { registerUser } from "../../controllers/jobseeker/register.controller";
import { loginUser } from "../../controllers/jobseeker/login.controller";
import { logoutUser } from "../../controllers/jobseeker/logout.controller";
import verifyUserJWT from "../../middleware/auth.middlewere";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyUserJWT, logoutUser)
export default router