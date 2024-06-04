const express = require("express");
const router = express.Router();
const {
  addProject,
  getProjects,
  updateProjectViews,
  updateProjectShares,
  updateDocumentViews,
  updateDocumentShares,
  updateLegalDocumentViews,
  updateLegalDocumentShares,
} = require("../controllers/projects");

router.post("/addproject", addProject);

router.get("/getprojects", getProjects);

router.post("/update-project-views", updateProjectViews);

router.post("/update-project-shares", updateProjectShares);

router.post("/update-document-views", updateDocumentViews);

router.post("/update-document-shares", updateDocumentShares);

router.post("/update-legal-document-views", updateLegalDocumentViews);

router.post("/update-legal-document-shares", updateLegalDocumentShares);

module.exports = router;
