const express = require("express");
const router = express.Router();
const {
  sendEmail,
  sendShareDocumentEmail,
  sendShareInfoEmail,
} = require("../controllers/sendemail");

router.post("/sendemail", sendEmail);

router.post("/send-share-document-email", sendShareDocumentEmail);

router.post("/send-share-info-email", sendShareInfoEmail);

module.exports = router;
