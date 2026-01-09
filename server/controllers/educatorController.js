import { clerkClient } from '@clerk/express'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator'
      }
    })

    return res.json({
      success: true,
      message: "You can publish a course now"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
