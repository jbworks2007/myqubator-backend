// MyOperator integration

exports.sendSms = (name, otp, to) => {
  return new Promise((resolve, reject) => {
    fetch(
      "http://smsaccount.api.myoperator.biz/v1/createuserotp?api_key=6183a266-fb49-4759-b776-8ecd765e9fca"
    )
      .then((response) => {
        //handle response
        console.log(response);
      })
      .then((message) => {
        console.log(message.sid);
        resolve(true);
      })
      .catch((error) => {
        console.log("Eror --", error);
        resolve(false);
      });
  });
};

// Twilio Integration

// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// exports.sendSms = (name, otp, to) => {
//    return new Promise((resolve, reject) => {
//       client.messages
//          .create({
//             body: `Dear ${name}, your E20 app authentication otp is ${otp} `,
//             to: `+91${to}`, // Text this number
//             // from :'+15005550006',
//             from: process.env.TWILIO_FROM,
//          })
//          .then((message) => {
//             console.log(message.sid);
//             resolve(true)
//          })
//          .catch((err) => {
//             console.log("Eror --", err)
//             resolve(false)
//          })
//    })
// }
