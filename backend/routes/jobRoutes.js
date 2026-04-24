import express from 'express'
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getMyJobs
} from '../controllers/jobController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Public routes (no login needed) ──────────────
router.get('/',    getAllJobs)    // anyone can browse jobs
router.get('/:id', getJobById)   // anyone can view a job

router.get('/user/my-jobs', protect, getMyJobs)

// ── Protected routes (login required) ────────────
router.post(
  '/',
  protect,                      // must be logged in
  restrictTo('employer'),       // must be an employer
  createJob
)

router.put(
  '/:id',
  protect,
  restrictTo('employer'),
  updateJob
)

router.delete(
  '/:id',
  protect,
  restrictTo('employer'),
  deleteJob
)

router.post(
  '/:id/apply',
  protect,                      // must be logged in
  restrictTo('jobseeker'),      // only jobseekers can apply
  applyToJob
)

export default router