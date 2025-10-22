import { Webhook } from "svix";
import User from "../models/Users.js";
import Stripe from "stripe";
import course from "../models/course.js";

// 🧩 Clerk webhook controller
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        return res.json({});
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({});
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({});
      }

      default:
        return res.json({ message: "Unhandled Clerk event type" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🧩 Stripe webhook controller
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ✅ FIX: use stripeInstance, not StripeInstance
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ FIX: use proper JavaScript switch-case
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId 
      });
      const purchaseId = session.data[0].metadata ;
      const purchaseData = await purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId);
      const courseData = await course.findById(purchaseData.courseId.to_string());

      courseData.enrolledStudents.push(userData);
      userData.enrolledCourses.push(courseData._id);
      await courseData.save();
      await userData.save();

      purchaseData.status = "success";
      await purchaseData.save();


      console.log("✅ PaymentIntent was successful!");

      break;

    case "payment_intent.payment_failed":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId 
      });
      const purchaseId = session.data[0].metadata ;
      const purchaseData = await purchase.findById(purchaseId)
      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
