import { Webhook } from 'svix'
import user from '../models/user.js'
import connectDB from '../configs/mongodb.js'

export const clerkWebhooks = async (req, res) => {
  console.log('🔥 CLERK WEBHOOK HIT 🔥')

  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    const payload = req.body.toString('utf8')
    const event = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    await connectDB()

    const { data, type } = event
    console.log('EVENT:', type)

    switch (type) {
      case 'user.created':
        await user.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        })
        break

      case 'user.updated':
        await user.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        })
        break

      case 'user.deleted':
        await user.findByIdAndDelete(data.id)
        break
    }

    // ✅ ONE response only
    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('CLERK WEBHOOK ERROR:', err)
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
}
