const jwt = require("jsonwebtoken");
const sha256 = require("sha256");

const User = require("../models/users");
const Otp = require("../models/otp");
const Admin = require("../models/admins");
const AdminOtp = require("../models/adminOtps");
const { sendSms } = require("../utils/sendSms");
const { sendDynamicEmail } = require("../utils/sendemail");

// const getUserByPhone = (phone) => {
//   return new Promise((resolve, reject) => {
//     User.findOne({ phone }).exec(async (err, user) => {
//       if (user) {
//         if (user.is_verified) {
//           resolve(user?.is_verified);
//         } else {
//           await User.deleteMany({ phone })
//             .then((res) => {
//               console.log("Data deleted", res);
//             })
//             .catch((error) => {
//               console.log(error);
//             });
//           resolve(false);
//         }
//       } else if (err) {
//         resolve({ hasError: true, err });
//       } else {
//         resolve(false);
//       }
//     });
//   });
// };

const createJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.signup = async (req, res) => {
  var { name, email, phone, pass, role } = req.body;
  pass = sha256(pass);
  var userData = {
    name,
    email,
    phone,
    pass,
    role,
  };

  // uncomment if phone is required
  //   if (!phone || phone.length < 10 || phone != parseInt(phone)) {
  //     return res.json({
  //       error: "Phone is required",
  //       code: "not_acceptable",
  //       message: "Failure",
  //       status: 406,
  //     });
  //   }

  var newUser = new User(userData);
  // console.log("newUser : ", newUser);

  if (email) {
    email = email.trim().toLowerCase();
    userData = {
      ...userData,
      email,
    };
  }
  let userEmail = await User.findOne({ email: newUser.email });
  if (userEmail) {
    return res.json({
      error: "Unique feild does not have duplicate values",
      code: "Failure",
      message: "Email is already register",
      status: 400,
    });
  } else {
    newUser
      .save()
      .then((user) => {
        return res.json({
          code: "success",
          message: "User saved succesfully",
          status: 200,
          user,
        });
      })
      .catch((err) => {
        return res.json({
          error: err,
          message: "Database Error",
          code: "server_error",
        });
      });
  }
};

exports.signin = async (req, res) => {
  var { email } = req.body;
  console.log("email -> ", email);
  const userone = await User.findOne({ email });
  if (userone && userone.is_verified) {
    return res.json({
      token: createJwtToken(userone),
      user: userone,
      status: 200,
      code: "success",
      message: "User authenticated successfully!",
    });
  } else {
    return res.json({
      status: 402,
      message: "user not found/not verified",
      code: "failed",
    });
  }
};

exports.verifyUser = async (req, res) => {
  var { email, otp } = req.body;
  console.log("email otp : ", email, otp);
  // phone = phone;
  const userone = await Otp.findOne({ email });
  if (!userone) {
    return res.json({
      message: "user not found",
      code: "failed",
      status: 400,
    });
  } else if (userone && !userone.is_valid) {
    return res.json({
      message: "otp is expired",
      code: "failed",
      status: 400,
    });
  } else if (userone.is_valid && userone.otp == otp) {
    await User.findOneAndUpdate(
      { email: userone.email },
      { is_verified: true }
    );
    return res.json({
      message: "User verified",
      code: "success",
      status: 200,
    });
  } else {
    return res.json({
      message: "wrong/invalid otp",
      code: "failed",
      status: 400,
    });
  }
};

exports.signin_verify = (req, res) => {
  var { phone, otp } = req.body;
  try {
    phone = phone;
    User.findOne({ phone }).exec((err, users) => {
      if (!users) {
        res.json({
          message: "error",
          code: "user_not_found",
          status: 404,
        });
      } else {
        Otp.findOne({ phone }).exec((err, user) => {
          if (user && typeof user.phone !== undefined) {
            if (user.otp == otp) {
              let { _id, phone, name, email } = users;
              Otp.findOneAndRemove({ email: email }).exec();

              return res.json({
                token: createJwtToken(user),
                user: { _id, phone, name, email },
                status: 200,
                code: "user_verified",
              });
            } else {
              return res.json({
                message: "Invalid OTP",
                code: "invalid_otp",
                status: 406,
              });
            }
          } else {
            return res.json({
              message: "error",
              code: "invalid_otp",
              status: 404,
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      message: "Failure",
      error,
    });
  }
  // res.status(200).json(response);
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout success",
    status: 200,
  });
};

exports.resetOtp = async (req, res) => {
  var { phone } = req.body;
  phone = phone;
  let otp = Math.floor(1000 + Math.random() * 9000);

  var createdAt = Date.now();
  await Otp.deleteMany({ phone }).exec();
  let newOtp = new Otp({ phone, otp, createdAt, is_valid: true });
  newOtp.save(async (err, result) => {
    if (!err || result) {
      await sendSms("User", otp, phone);
      res.json({
        message: "otp sent to phone number",
        status: 200,
      });
    } else {
      return res.json({
        error: err,
        message: "server_error",
        code: "failed",
        status: 500,
      });
    }
  });
};

exports.validateToken = (req, res, next) => {
  const { token } = req.body;
  // next()
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    return res.status(200).json({
      code: "success",
      message: "Authorized User",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      code: "failed",
    });
  }
};

exports.sendOtpEmail = async (req, res) => {
  console.log("yes called the forget password : ", req.body);
  const { email } = req.body;
  await User.findOne({ email }).then(async (userone) => {
    if (userone) {
      console.log("user found");

      await Otp.deleteMany({ email });
      let otp = Math.floor(100000 + Math.random() * 900000);

      // if (email == "admin@gmail.com") otp = 1234;

      // await TempUser.deleteMany({ email }).exec();

      const org = "myqubator";
      const resipient = [{ address: email, displayName: "" }];

      const mailOptions = {
        from: org,
        to: resipient,
        subject: `${org} Verification Otp`,
        html: `<div>
                <p>Dear <span style="font-weight:bold;">${email}</span>, your ${org} Verification OTP is : 
                <span style="font-weight:bold;">${otp}</span>.</p>
                <p><span style="font-weight:bold;">Note : </span>Please, Do not share your otp with anyone.</p>
                <p>Thank You,</p>
            </div>`,
      };

      try {
        await sendDynamicEmail(mailOptions);
      } catch (error) {
        console.log("Error sending mail : ", error);
      }

      var createdAt = Date.now();
      let newOtp = new Otp({ email, otp, createdAt });
      newOtp.save().then((success) => {
        if (success) {
          return res.json({
            code: "success",
            message: "otp saved for user",
            status: 200,
          });
        } else {
          return res.json({
            status: 500,
            message: "Internal Server Error",
            code: "failed",
          });
        }
      });
    } else {
      return res.json({
        status: 400,
        message: "User not found",
        code: "failed",
      });
    }
  });
};

exports.forgotPasswordSendOtp = (req, res) => {
  console.log("yes called the forget password");
  const { email } = req.body;
  Admin.findOne({ email }).exec(async (err, admin) => {
    if (admin) {
      console.log("admin found");

      await AdminOtp.deleteMany({ email }).exec();
      let otp = Math.floor(100000 + Math.random() * 900000);

      if (email == "admin@gmail.com") otp = 1234;

      // await TempUser.deleteMany({ email }).exec();

      const mailOptions = {
        from: `E20 <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `E20 Otp`,
        html: `<div>
                <p>Dear <span style="font-weight:bold;">${email}</span>, your E20 OTP is : <span style="font-weight:bold;">${otp}</span>.</p>
                <p><span style="font-weight:bold;">Note : </span>Please, Do not share your otp with anyone.</p>
                <p>Thank You,</p>
            </div>`,
      };

      try {
        let emailStatus = await sendDynamicEmail(mailOptions);
        // if (emailStatus) {
        //   let newUser = await new Admin({
        //     ...userData,
        //     password,
        //     username,
        //     otp,
        //   });
        //   newUser.save((err, success) => {
        //     if (err) {
        //       return res.json({
        //         error: err,
        //         message: "error",
        //         code: "server_error",
        //         status: 404,
        //       });
        //     }
        //     res.status(200).json({
        //       message: "otp sent to email address",
        //       status: 200,
        //       code: "otp_sent",
        //     });
        //   });
        // } else {
        //   console.log("Error sending email");
        //   return res.json({
        //     code: "email_send_error",
        //     message: "Email Send failed",
        //     status: 500,
        //   });
        // }
      } catch (error) {
        console.log("Error sending mail : ", error);
      }

      var createdAt = Date.now();
      let newAdminOtp = new AdminOtp({ email, otp, createdAt });
      newAdminOtp.save((error, success) => {
        if (success) {
          return res.json({
            code: "success",
            message: "success",
            status: 200,
          });
        } else {
          return res.json({
            status: 500,
            message: "Internal Server Error",
            code: "failed",
          });
        }
      });
    } else if (admin == null) {
      return res.json({
        status: 404,
        message: "Email invalid",
        code: "invalid",
      });
    } else {
      return res.json({
        status: 500,
        message: "Internal Server Error",
        code: "failed",
      });
    }
  });
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;
  let newPassword = sha256(password);
  let user = await User.findOne({ email });
  console.log("user ----> ", user);

  if (user && user.is_verified) {
    await User.findOneAndUpdate({ email: email }, { pass: newPassword });
    return res.json({
      code: "success",
      message: "Password changed seccessfully!",
      status: 200,
    });
  } else {
    return res.json({
      status: 404,
      message: "User not found/not verified",
      code: "failed",
    });
  }

  // AdminOtp.findOne({ email, otp }).exec(async (err, admin) => {
  //   if (admin) {
  //     await AdminOtp.deleteMany({ email }).exec();
  //     Admin.findOneAndUpdate({ email }, { password: newPassword }).exec(
  //       (error, success) => {
  //         if (success) {
  //           return res.json({
  //             code: "success",
  //             message: "success",
  //             status: 200,
  //           });
  //         } else {
  //           return res.json({
  //             status: 500,
  //             message: "Internal Server Error",
  //             code: "failed",
  //           });
  //         }
  //       }
  //     );
  //   } else if (admin == null) {
  //     return res.json({
  //       status: 404,
  //       message: "Email invalid",
  //       code: "invalid",
  //     });
  //   } else {
  //     return res.json({
  //       status: 500,
  //       message: "Internal Server Error",
  //       code: "failed",
  //     });
  //   }
  // });
};
