// const { client, sender, transporter } = require("./emailConfig");
const { EmailClient } = require("@azure/communication-email");

const client = new EmailClient(process.env.CONNECTIONSTRING);
const sender = "DoNotReply@dd037ad3-513f-4ca4-b6ff-0aa5f2994be0.azurecomm.net";

async function sendDynamicEmail(mailOptions) {
  const { to, html, subject } = mailOptions;

  const toRecipientsList = {
    to: to,
  };

  const emailContent = { subject, html };

  const POLLER_WAIT_TIME = 10;

  try {
    const message = {
      senderAddress: sender,
      content: emailContent,
      recipients: toRecipientsList,
    };

    const poller = await client.beginSend(message);

    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started.";
    }

    let timeElapsed = 0;

    while (!poller.isDone()) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise((resolve) =>
        setTimeout(resolve, POLLER_WAIT_TIME * 1000)
      );
      timeElapsed += 10;

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw "Polling timed out.";
      }
    }

    console.log("poller status :", poller.getResult().status);

    if (poller.getResult().status === "Succeeded") {
      console.log(
        `Successfully sent the email (operation id: ${poller.getResult().id})`
      );
      return true;
    } else {
      throw poller.getResult().error;
    }
  } catch (e) {
    console.log(e);
  }

  //  OLD METHOD TO IMPLEMENT

  //   return new Promise(async (resolve, reject) => {
  //     resolve(true);
  //     const { to, html, subject } = mailOptions;

  //     const toRecipientsList = {
  //       to: [{ address: to, displayName: "" }],
  //     };

  //     const emailContent = { subject, html };

  //     try {
  //       const emailMessage = {
  //         senderAddress: sender,
  //         content: emailContent,
  //         recipients: toRecipientsList,
  //       };

  //       const sendResult = await client.beginSend(emailMessage);

  //       if (sendResult && sendResult.messageId) {
  //         const messageId = sendResult.messageId;
  //         if (messageId === null) {
  //           resolve(false);
  //         }
  //         console.log("Send email success, MessageId :", messageId);
  //         resolve(true);
  //       } else {
  //         console.error(
  //           "Something went wrong when trying to send this email: ",
  //           sendResult
  //         );
  //         resolve(false);
  //       }
  //     } catch (e) {
  //       console.log(
  //         "################### Exception occoured while sending email #####################",
  //         e
  //       );
  //       resolve(false);
  //     }
  //   });
}

module.exports = { sendDynamicEmail };
