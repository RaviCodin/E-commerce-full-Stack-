const express = require("express");
const {
  registationUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  getUserDetails,
  passwordUpdate,
  profileUpdate,
  getAllUser,
  getsingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userControl");

const { isAuthanticatedUser, authourizRoles } = require("../middleWare/auth");

const router = express.Router();

router.route("/register").post(registationUser);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthanticatedUser, getUserDetails);
router.route("/loggout").get(logout);
router.route("/password/update").put(isAuthanticatedUser, passwordUpdate);
router.route("/profile/update").put(isAuthanticatedUser, profileUpdate);

router
  .route("/admin/users")
  .get(isAuthanticatedUser, authourizRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthanticatedUser, authourizRoles("admin"), getsingleUser);
  
router
  .route("/admin/user/:id")
  .put(isAuthanticatedUser, authourizRoles("admin"), updateUserRole)
  .delete(isAuthanticatedUser, authourizRoles("admin"), deleteUser);

module.exports = router;
