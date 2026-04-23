import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// ─────────────────────────────────────────
// Protect middleware — verifies JWT token
// ─────────────────────────────────────────
export const protect = async (req, res, next) => {
  try {
    let token

    // 1. Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract the token (remove "Bearer " from the start)
      token = req.headers.authorization.split(' ')[1]
    }

    // 2. If no token found → block the request
    if (!token) {
      return res.status(401).json({
        error: 'Not authorised — no token provided'
      })
    }

    // 3. Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { id: "64f1a2b3...", role: "jobseeker", iat: ..., exp: ... }

    // 4. Find the user in database using ID from token
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        error: 'Not authorised — user no longer exists'
      })
    }

    // 5. Attach user to request object
    req.user = user

    // 6. Pass control to the next function (controller)
    next()

  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({
      error: 'Not authorised — invalid token'
    })
  }
}


// ─────────────────────────────────────────
// Role middleware — restricts by user role
// ─────────────────────────────────────────
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied — only ${roles.join(', ')} can do this`
      })
    }
    next()
  }
}