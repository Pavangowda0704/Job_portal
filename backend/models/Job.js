import mongoose from 'mongoose'

// Define the Schema — the blueprint for a Job
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },

    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
    },

    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
      default: 'Full-time',
    },

    salary: {
      type: String,
      default: 'Not disclosed',
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
    },

    tags: {
      type: [String],   // array of strings e.g. ["React", "Node"]
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',      // links to the User model (Phase 2.5)
      required: true,
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    // list of users who applied
      }
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,   // auto adds createdAt and updatedAt fields
  }
)

// Create the Model from the Schema
const Job = mongoose.model('Job', jobSchema)

export default Job