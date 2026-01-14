import { getAuth } from '@clerk/express'
import user from '../models/user.js'
import purchase from '../models/purchase.js'
import Stripe from 'stripe'
import courseProgress from '../models/courseProgress.js'
import course from '../models/course.js'

// get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const id = userId

    const User = await user.findById(id)

    if (!User) {
      return res.json({ success: false, message: 'user not found' })
    }

    res.json({ success: true, User })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    const userData = await user
      .findById(userId)
      .populate('enrolledCourses')

    if (!userData) {
      return res.json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// purchase course                    DONEE
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const { userId } = getAuth(req)
    const { origin } = req.headers

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    const userData = await user.findById(userId)
    const courseData = await course.findById(courseId)

    if (!userData || !courseData) {
      return res.json({ succcess: false, message: 'data not found' })
    }

    const amount = Math.round(
      courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
    )

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount
    }

    const newPurchase = await purchase.create(purchaseData)

    // stripe gatway initialization
    const stripeInstace = new Stripe(process.env.STRIPE_SECRET_KEY)

    const currency = process.env.CURRENCY.toLowerCase()

    // creating line items for stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle
          },
          unit_amount: Math.floor(newPurchase.amount) * 100
        },
        quantity: 1
      }
    ]
    const session = await stripeInstace.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString()
      }
    })
    res.json({ success: true, session_url: session.url })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// update user course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const { courseId, lectureId } = req.body
    const progressData = await courseProgress.findOne({ userId, courseId }) 

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        res.json({ success: true, message: 'lecture already completed' })
      }
      progressData.lectureCompleted.push(lectureId)
      await progressData.save()
    } else {
      progressData.create({
        userId,
        courseId,
        lectureCompleted: [lectureId]
      })
    }
    res.json({ success: true, message: 'progress updated' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// get user progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const { courseId } = req.body
    const progressData = await courseProgress.findOne({ userId, courseId })
    res.json({ success: true, progressData })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// add user ratings to course
export const addUserRating = async (req, res) => {
  const { userId } = getAuth(req)
  const { courseId, rating } = req.body

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: 'invalid details' })
  }
  try {
    const course = await course.findById(courseId)
    if (!course) {
      const user = await user.findById(userId)
      if (!user || !user.enrolledCourses.includes(courseId))
        return res.json({
          success: false,
          message: 'User has not purchased this course'
        })
    }
    const existingRatingIndex = course.courseRatings.findIndex(
      r => r.userId == userId
    )
    if (existingRatingIndex >= 0) {
      course.courseRatings[existingRatingIndex].rating = rating
    } else {
      course.courseRatings.push({ userId, rating })
    }
    await course.save()
    res.json({ success: true, message: 'Rating added' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
