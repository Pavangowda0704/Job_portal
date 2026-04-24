import Job from '../models/Job.js'

// ─────────────────────────────────────
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
// ─────────────────────────────────────
export const getAllJobs = async (req, res) => {
  try {
    // Get search and filter from URL query
    // e.g. /api/jobs?search=react&type=Full-time
    const { search, type, location } = req.query

    // Build filter object
    let filter = {}

    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { company:  { $regex: search, $options: 'i' } },
        { tags:     { $regex: search, $options: 'i' } },
      ]
    }

    if (type)     filter.type     = type
    if (location) filter.location = { $regex: location, $options: 'i' }

    // Fetch jobs from MongoDB
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })  // newest first
      .populate('postedBy', 'name email company') // get poster details

    res.json({
      count: jobs.length,
      jobs
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
// ─────────────────────────────────────
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email company')

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(job)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (employers only)
// ─────────────────────────────────────
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      tags,
      featured
    } = req.body

    const job = await Job.create({
      title,
      company,
      location,
      type,
      salary,
      description,
      tags,
      featured,
      postedBy: req.user._id,   // from auth middleware (Phase 2.7)
    })

    res.status(201).json({
      message: '✅ Job created successfully',
      job
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (job owner only)
// ─────────────────────────────────────
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Make sure the logged-in user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorised to edit this job' })
    }

    // Update the job with new data
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      message: '✅ Job updated successfully',
      job: updatedJob
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (job owner only)
// ─────────────────────────────────────
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Make sure the logged-in user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorised to delete this job' })
    }

    await job.deleteOne()

    res.json({ message: '✅ Job deleted successfully' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// ─────────────────────────────────────────
// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (jobseekers only)
// ─────────────────────────────────────────
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    // Check if already applied
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({
        error: 'You have already applied to this job'
      })
    }

    // Add user to applicants list
    job.applicants.push(req.user._id)
    await job.save()

    res.json({ message: '✅ Application submitted successfully!' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// Get all applicants for a specific job (Employer only)
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applicants', 'name email') // This pulls name/email from User model
    
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    // Check if the person asking is the one who posted the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// ─────────────────────────────────────────
// @desc    Get jobs posted by logged-in user
// @route   GET /api/jobs/user/my-jobs
// @access  Private (employers only)
// ─────────────────────────────────────────
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('applicants', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      count: jobs.length,
      jobs
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}