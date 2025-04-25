import express from 'express';
import { createProfile, deleteProfile, getProfile, updateProfile } from '../../controllers/jobseeker/jonseekerprofilebasicinfo.controller';
import verifyUserJWT from '../../middleware/auth.middlewere';
const router = express.Router();

// Jobseeker profile routes
router.post('/profile', verifyUserJWT, createProfile); // Create profile
router.get('/profile/:userId', verifyUserJWT, getProfile); // Get profile
router.put('/profile/:userId', verifyUserJWT, updateProfile); // Update profile
router.delete('/profile/:userId', verifyUserJWT, deleteProfile); // Delete profile



export default router;
