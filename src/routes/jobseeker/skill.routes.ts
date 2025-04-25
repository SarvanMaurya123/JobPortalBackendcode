import express from 'express'
import verifyUserJWT from '../../middleware/auth.middlewere'
import { createSkill, deleteSkill, getSkills } from '../../controllers/jobseeker/jobseekerskills'


const router = express.Router()

router.get('/skills/:jobseekerId', verifyUserJWT, getSkills)
router.post('/skills', verifyUserJWT, createSkill)
router.delete('/skills/:id', verifyUserJWT, deleteSkill)

export default router
