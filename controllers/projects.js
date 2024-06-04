const { response } = require("express");
const Project = require("../models/projects");
const { findOne } = require("../models/users");

// Example response from mongoose 8 docs
exports.addProject = async (req, res) => {
  let project = req.body;
  console.log("Project : ", project);

  let newProject = new Project(project);
  await newProject
    .save()
    .then((projectone) => {
      return res.json({
        code: "success",
        message: "Project save succesfully",
        status: 200,
        projectone,
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
        message: "Database Error",
        code: "server_error",
      });
    });
};

exports.updateProjectViews = async (req, res) => {
  let { project_id, name } = req.body;
  const project = await Project.findOne({ project_id });
  if (project && project.name === name) {
    await Project.findOneAndUpdate(
      { project_id: project.project_id },
      { views: project.views + 1 }
    );
    return res.json({
      code: "success",
      message: "Project views updated succesfully",
      status: 200,
    });
  } else {
    return res.json({
      status: 400,
      message: "project not found",
      code: "failed",
    });
  }
};

exports.updateProjectShares = async (req, res) => {
  let { project_id, name } = req.body;
  const project = await Project.findOne({ project_id });
  if (project && project.name === name) {
    await Project.findOneAndUpdate(
      { project_id: project.project_id },
      { shares: project.shares + 1 }
    );
    return res.json({
      code: "success",
      message: "Project share count updated succesfully",
      status: 200,
    });
  } else {
    return res.json({
      status: 400,
      message: "project not found",
      code: "failed",
    });
  }
};

exports.updateDocumentViews = async (req, res) => {
  let { project_id, doc_id, doc_name } = req.body;
  const project = await Project.findOne({ project_id });
  if (!project) {
    return res.json({
      status: 400,
      message: "Project not found",
      code: "failed",
    });
  } else {
    const documents = project.documents;
    let document_id, document_views;
    documents.map(async (key) => {
      if (key.doc_id === doc_id && key.doc_name === doc_name) {
        // This will check whether the document with the id and name exits or not
        document_id = key.doc_id;
        document_views = key.views;
      }
    });
    if (document_id && document_views) {
      await Project.findOneAndUpdate(
        { "documents.doc_id": document_id },
        {
          $set: {
            "documents.$.views": document_views + 1,
          },
        }
      );
      return res.json({
        code: "success",
        message: "Document views updated succesfully",
        status: 200,
      });
    } else {
      return res.json({
        code: "failed",
        message: "Document does not exits",
        status: 400,
      });
    }
  }
};

exports.updateLegalDocumentViews = async (req, res) => {
  let { project_id, doc_id, doc_name } = req.body;
  const project = await Project.findOne({ project_id });
  if (!project) {
    return res.json({
      status: 400,
      message: "Project not found",
      code: "failed",
    });
  } else {
    const legal_documents = project.legal_documents;
    let document_id, document_views;
    legal_documents.map(async (key) => {
      if (key.doc_id === doc_id && key.doc_name === doc_name) {
        // This will check whether the document with the id and name exits or not
        document_id = key.doc_id;
        document_views = key.views;
      }
    });
    if (document_id && document_views) {
      await Project.findOneAndUpdate(
        { "legal_documents.doc_id": document_id },
        {
          $set: {
            "legal_documents.$.views": document_views + 1,
          },
        }
      );
      return res.json({
        code: "success",
        message: "Document views updated succesfully",
        status: 200,
      });
    } else {
      return res.json({
        code: "failed",
        message: "Document does not exits",
        status: 400,
      });
    }
  }
};

exports.updateDocumentShares = async (req, res) => {
  let { project_id, doc_id, doc_name } = req.body;
  const project = await Project.findOne({ project_id });
  if (!project) {
    return res.json({
      status: 400,
      message: "Project not found",
      code: "failed",
    });
  } else {
    const documents = project.documents;
    let document_id, document_shares;
    documents.map(async (key) => {
      if (key.doc_id === doc_id && key.doc_name === doc_name) {
        // This will check whether the document with the id and name exits or not
        document_id = key.doc_id;
        document_shares = key.shares;
      }
    });
    if (document_id && document_shares) {
      await Project.findOneAndUpdate(
        { "documents.doc_id": document_id },
        {
          $set: {
            "documents.$.shares": document_shares + 1,
          },
        }
      );
      return res.json({
        code: "success",
        message: "Document share count updated succesfully",
        status: 200,
      });
    } else {
      return res.json({
        code: "failed",
        message: "Document does not exits",
        status: 400,
      });
    }
  }
};

exports.updateLegalDocumentShares = async (req, res) => {
  let { project_id, doc_id, doc_name } = req.body;
  const project = await Project.findOne({ project_id });
  if (!project) {
    return res.json({
      status: 400,
      message: "Project not found",
      code: "failed",
    });
  } else {
    const legal_documents = project.legal_documents;
    let document_id, document_shares;
    legal_documents.map(async (key) => {
      if (key.doc_id === doc_id && key.doc_name === doc_name) {
        // This will check whether the document with the id and name exits or not
        document_id = key.doc_id;
        document_shares = key.shares;
      }
    });
    if (document_id && document_shares) {
      await Project.findOneAndUpdate(
        { "legal_documents.doc_id": document_id },
        {
          $set: {
            "legal_documents.$.shares": document_shares + 1,
          },
        }
      );
      return res.json({
        code: "success",
        message: "Document share count updated succesfully",
        status: 200,
      });
    } else {
      return res.json({
        code: "failed",
        message: "Document does not exits",
        status: 400,
      });
    }
  }
};

exports.getProjects = async (req, res) => {
  let projects = await Project.find({});
  if (projects) {
    return res.json({
      code: "success",
      message: "Project retrived succesfully",
      status: 200,
      projects,
    });
  } else {
    return res.json({
      status: 400,
      message: "projects not found",
      code: "failed",
    });
  }
};
