import { Router } from "express"
import { registeremployer } from "../../controllers/employer/reegister.controller"
import { loginemployer } from "../../controllers/employer/login.controller"
import { logoutemployer } from "../../controllers/employer/logout.controller"
import verifyEmployerJWT from "../../middleware/employer.middlewere"

const router = Router()

router.route("/register").post(registeremployer)
router.route("/login").post(loginemployer)
router.route("/logout").post(verifyEmployerJWT, logoutemployer)
export default router