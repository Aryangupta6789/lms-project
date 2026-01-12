import { getAuth } from '@clerk/express'
import user from '../models/user.js'
import purchase from '../models/purchase.js'
import Stripe from 'stripe'
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
    const id = userId

    const userData = await user.findById(id).populate('enrolledCourses')

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
}

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const { userId } = getAuth(req)
    const { origin } = req.headers

    const userData = await user.findById(userId)
    const courseData = await course.findById(courseId)

    if (!userData || !courseData) {
      res.json({ succcess: false, message: 'data not found' })
    }

    const purchaseData = {
      courseId: courseData.id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2)
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
