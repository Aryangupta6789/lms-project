export const protectedEducator = (req, res, next) => {
  try {
    const userId = req.auth?.userId
    const role = req.auth?.sessionClaims?.publicMetadata?.role

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      })
    }

    if (role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized Access'
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
