const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const Payment = require("./models/db");
const crypto = require("crypto");
// const emailjs = require("@emailjs/browser");
const OPT = require("./models/opt");
// const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const GoogleSignIn = require("./models/authUser");
require("dotenv").config();

const app = express();
const PORT = 8080;

const CLIENT_ID = process.env.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

// Function to connect to database
async function connectDb() {
  try {
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("DB connection successful");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
}

connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Razorpay Order Route
app.post("/api/v1/order", async (req, res) => {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100), // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Fixed spelling
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Order Error:", err);
        return res.status(500).json({ message: "Something went wrong" });
      }

      console.log("Order Created:", order);
      res.status(200).json(order);
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Razorpay Payment Verification Route
app.post("/api/v1/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY) // Fixed incorrect usage
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await payment.save();

      return res.json({ message: "Payment Successful" });
    } else {
      return res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// otp generation -> will need a paid version of
// emailjs to send restApi requests can use later once
// we get paid version or use nodemailer

// app.post("/api/v1/otp-generation", async (req, res) => {
//   const { email, phone } = req.body;

//   if (!email || !phone) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const otp = Math.floor(1000 + Math.random() * 9000);

//   // Store in DB if needed
//   // await OTP.create({ otp });

//   const EMAILJS_SERVICE_ID = "service_yc16aof";
//   const EMAILJS_TEMPLATE_ID = "template_16s6r78";
//   const EMAILJS_PUBLIC_KEY = "TtMr2AajnIkmAef4a";
//   const EMAILJS_PRIVATE_KEY = "q-u6pRbBly7yla-FeXd8p"; // Keep this safe!

//   const templateParams = {
//     to_email: email,
//     otp: otp,
//     name: "User",
//     phone: phone,
//   };

//   try {
//     const response = await axios.post(
//       "https://api.emailjs.com/api/v1.0/email/send",
//       {
//         service_id: EMAILJS_SERVICE_ID,
//         template_id: EMAILJS_TEMPLATE_ID,
//         user_id: EMAILJS_PUBLIC_KEY, // This is actually still required
//         template_params: templateParams,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${EMAILJS_PRIVATE_KEY}`,
//         },
//       }
//     );

//     res.status(200).json({ message: "OTP sent successfully", otp }); // remove otp in prod
//   } catch (error) {
//     console.error("EmailJS error:", error?.response?.data || error.message);
//     res.status(500).json({ message: "Failed to send OTP email." });
//   }
// });

// test route to save the otp to the database and check it

// generating the otp route


// 

app.post("/api/v1/otp-save", async (req, res) => {
  const { otp } = req.body;

  try {
    const newOtp = await OPT.create({ otp });
    res.status(200).json({ message: "OTP saved", data: newOtp });
  } catch (error) {
    console.error("OTP save error:", error);
    res.status(500).json({ message: "Failed to save OTP" });
  }
});


// confirming the opt route
app.get("/api/v1/otp-compare", async (req, res) => {
  const { otp } = req.query;

  try {
    const existing = await OPT.findOne({ otp });

    if (existing) {
      return res.status(200).json({ message: "Correct OTP" });
    }

    return res.status(400).json({ message: "Wrong OTP" });
  } catch (error) {
    console.error("Error comparing: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

// google auth route

app.post("/api/v1/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name, picture } = payload;

    const user = await GoogleSignIn.create({
      name: name,
      email: email,
      sub: sub,
    });

    res.json({
      message: "User verified",
      user: { sub, email, name, picture },
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
