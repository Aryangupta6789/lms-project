import { clerkClient } from '@clerk/express'

export const protectedEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      })
    }

    let role = req.auth?.sessionClaims?.publicMetadata?.role

    // fallback if JWT old hai
    if (!role) {
      const user = await clerkClient.users.getUser(userId)
      role = user.publicMetadata?.role
    }

    if (role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: 'Educator access only'
      })
    }

    next()
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
