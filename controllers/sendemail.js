const { sendDynamicEmail } = require("../utils/sendemail");

exports.sendEmail = async (req, res) => {
  let { customer_name, customer_email } = req.body;

  const org = "myqubator";
  const adminList = [
    { address: "jbworks2007@gmail.com", displayName: "" },
    // { address: "jameel.q@myqubator.com", displayName: "" },
  ];

  const mailOptions = {
    from: org,
    to: adminList,
    subject: `${org} - Document Central Lead`,
    html: `<div>
                <p>The person detailed below have logged in our Document Central.</p>
                <p>Customer Name : ${customer_name}</p>
                <p>Customer Email : ${customer_email}</p>
                <p>Thank You.</p>
            </div>`,
  };

  try {
    console.log("trying email send");
    let emailStatus = await sendDynamicEmail(mailOptions);
    if (emailStatus) {
      return res.status(200).json({
        message: "Email sent successfully!",
        status: 200,
        code: "success",
      });
    } else {
      console.log("Error sending email");
      return res.json({
        code: "failed",
        message: "Email Send failed",
        status: 500,
      });
    }
  } catch (error) {
    console.log("Error sending mail : ", error);
  }
};

exports.sendShareDocumentEmail = async (req, res) => {
  let {
    customer_name,
    customer_email,
    sharer_email,
    project_name,
    document_name,
  } = req.body;

  const org = "myqubator";
  const sharerList = [{ address: sharer_email, displayName: "" }];

  const mailOptions = {
    from: org,
    to: sharerList,
    subject: `${org} - Document shared`,
    html: `<div>
                <h5>Hello ${sharer_email}
                <p><b>${customer_name}</b> with email ${customer_email} have shared a project/dcument detail below:</p>
                <p>Organization : ${org}<p>
                <p>Project Name : ${project_name}</p>
                <p>Document Name : ${document_name}</p>
                <p>Please click the below link to visit the document</p>
                <a href="https://investor.myqubator.com/registration" target="_blank">Click here to view the document</a>
                <p>Thank You.</p>
            </div>`,
  };

  try {
    console.log("trying email send");
    let emailStatus = await sendDynamicEmail(mailOptions);
    if (emailStatus) {
      return res.status(200).json({
        message: "Email sent successfully!",
        status: 200,
        code: "success",
      });
    } else {
      console.log("Error sending email");
      return res.json({
        code: "failed",
        message: "Email Send failed",
        status: 500,
      });
    }
  } catch (error) {
    console.log("Error sending mail : ", error);
  }
};

exports.sendShareInfoEmail = async (req, res) => {
  let {
    customer_name,
    customer_email,
    sharer_email,
    project_name,
    document_name,
  } = req.body;

  const org = "myqubator";
  const adminList = [
    { address: "jbworks2007@gmail.com", displayName: "" },
    // { address: "jameel.q@myqubator.com", displayName: "" },
  ];

  const mailOptions = {
    from: org,
    to: adminList,
    subject: `${org} - Share Info Lead`,
    html: `<div>
                <p><b>${customer_name}</b> with email ${customer_email} have shared a project/dcument detail below:</p>
                <p>Shared to : ${sharer_email}</p>
                <p>Project Name : ${project_name}</p>
                <p>Document Name : ${document_name}</p>
                <p>Thank You.</p>
            </div>`,
  };

  try {
    console.log("trying email send");
    let emailStatus = await sendDynamicEmail(mailOptions);
    if (emailStatus) {
      return res.status(200).json({
        message: "Email sent successfully!",
        status: 200,
        code: "success",
      });
    } else {
      console.log("Error sending email");
      return res.json({
        code: "failed",
        message: "Email Send failed",
        status: 500,
      });
    }
  } catch (error) {
    console.log("Error sending mail : ", error);
  }
};
