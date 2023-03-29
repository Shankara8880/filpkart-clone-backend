const User = require("./../models/User")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Employee = require("../models/Employee")
const Cart = require("../models/Cart")
const { OAuth2Client } = require("google-auth-library")
const { sendEmail } = require("../utils/email")

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body


  if (!email || !password) {
    return res.status(401).json({
      massage: "All field Required"
    })
  }

  const result = await User.findOne({ email }).lean()
  if (!result) {
    return res.status(401).json({
      message: "Email is Not Register With as"
    })

  }

  const verify = await bcrypt.compare(password, result.password)
  if (!verify) {
    return res.status(401).json({
      message: "email or Password Wrong"
    })
  }

  if (!result.active) {
    return res.status(401).json({
      message: "Account Bloacked By Admin"
    })
  }

  const token = jwt.sign({ id: result._id }, process.env.JWT_KEY,
    {
      expiresIn: "1d"
    }
  )

  const cart = await Cart.find({ userId: result._id })
  res.json({
    message: "Login Success",
    result: {
      name: result.name,
      email: result.email,
      cart,
      token
    }
  })
})

exports.loginEmployee = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(401).json({
      massage: "All field Required"
    })
  }

  const result = await Employee.findOne({ email })
  if (!result) {
    return res.status(401).json({
      message: "Email is Not Register With as"
    })

  }

  const verify = await bcrypt.compare(password, result.password)
  if (!verify) {
    return res.status(401).json({
      message: "email or Password Wrong"
    })
  }
  if (!result.active) {
    return res.status(401).json({
      message: "Acount Is Blocked Get in touch with Admin"
    })
  }
  const token = jwt.sign({ id: result._id }, process.env.JWT_KEY)
  res.cookie("token", "Bearer " + token, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    // secure: true  // for hosting time secure on
  })
  res.json({
    message: "Employee Login Success",
    result: {
      name: result.name,
      email: result.email,
      id: result._id,
      token
    }
  })
})



exports.continueWithGoogle = asyncHandler(async (req, res) => {
  const { tokenId } = req.body

  if (!tokenId) {
    return res.status(401).json({
      massage: "Please Provide Google Token ID"
    })
  }

  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  const { payload: { name, email, picture } } = await googleClient.verifyIdToken({
    idToken: tokenId
  })

  const result = await User.findOne({ email }).lean()
  if (result) {
    if (!result.active) {
      res.status(401).json({
        message: "Account blocked by Admin"
      })
    }
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY,
      {
        expiresIn: "1d"
      }
    )
    const cart = await Cart.find({ userId: result._id })
    res.json({
      message: "Login Success",
      result: {
        ...result,
        cart,
        token
      }
    })
    //login
  } else {
    //register
    const password = await bcrypt.hash(Date.now().toString(), 10)
    const user = {
      name,
      email,
      password
    }
    const result = await User.create(user).lean()
    const token = jwt.sign({ id: result._id }, process.env.JWT_KEY, {
      expiresIn: "1d"
    })
    res.json({
      message: "User Register Successfully",
      result: {
        ...result,
        cart: [],
        token
      }
    })
  }

  const verify = await bcrypt.compare(password, result.password)
  if (!verify) {
    return res.status(401).json({
      message: "email or Password Wrong"
    })
  }
})

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(401).json({
      massage: "Email Required"
    })
  }
  const result = await User.findOne({ email }).lean()
  if (!result) {
    return res.status(401).json({
      message: "Email is Not Register With US"
    })

  }
  sendEmail({
    sendTo: email,
    sub: "Reset Password",
    msg: `http://localhost:5173/reset-password/${result._id}`,
  })
  res.json({
    message: "Email Sent Success"
  })
})
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password, id } = req.body
  if (!password) {
    return res.status(401).json({
      massage: "Password Required"
    })
  }
  const hashpass = await bcrypt.hash(password, 10)
  const result = await User.findByIdAndUpdate(id, { password: hashpass })
  res.json({
    message: "Password Updated Successfully"
  })
})