import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// ─────────────────────────────────────
// Helper — generate a JWT token
// ─────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                          // payload — data inside token
    process.env.JWT_SECRET,               // secret key
    { expiresIn: process.env.JWT_EXPIRE } // expiry
  )
}


// ─────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered. Please login.'
      })
    }

    // 2. Create the user
    // Password is auto-hashed by our pre('save') middleware
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'jobseeker',
      company: company || '',
    })

    // 3. Generate token
    const token = generateToken(user._id, user.role)

    // 4. Send response
    res.status(201).json({
      message: '✅ Registration successful!',
      token,
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        company: user.company,
      }
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      })
    }

    // 2. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    // 3. Check password using our matchPassword method
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    // 4. Generate token
    const token = generateToken(user._id, user.role)

    // 5. Send response
    res.json({
      message: '✅ Login successful!',
      token,
      user: {
        _id:     user._id,
        name:    user.name,
        email:   user.email,
        role:    user.role,
        company: user.company,
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// ─────────────────────────────────────
// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware (Phase 2.8)
    const user = await User.findById(req.user._id)
      .select('-password') // never send password back

    res.json(user)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}