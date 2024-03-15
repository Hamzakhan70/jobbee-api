const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
// module.exports = router.get("/jobs", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "This route will display all the jobs in future",
//   });
// });

// ----------------alternate to above is given below
const {
  getJobs,
  getJob,
  newJob,
  updateJob,
  deleteJob,
  jobStats,
  applyJob,
} = require("../controllers/jobsController");

router.route("/jobs").get(getJobs);
router
  .route("/job/new")
  .post(isAuthenticatedUser, authorizeRoles("employeer", "admin"), newJob);
router
  .route("/job/:id")
  .put(isAuthenticatedUser, authorizeRoles("employeer", "admin"), updateJob)
  .delete(isAuthenticatedUser, authorizeRoles("employeer", "admin"), deleteJob);
router
  .route("/job/:id/apply")
  .put(isAuthenticatedUser, authorizeRoles("user"), applyJob);
router.route("/job/:id/:slug").get(getJob);
router.route("/stats/:topic").get(jobStats);

module.exports = router;
