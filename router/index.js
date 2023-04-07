const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");
const mailController = require("../controllers/mail-controller");
const roleController = require("../controllers/role-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");

router.post(
  "/users/add",
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
	roleMiddleware(["ADMIN"]),
  userController.addUser
);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/activate/:link", mailController.activate);
router.get("/refresh", authController.refresh);
//router.get('/users', roleMiddleware(['USER']), userController.getAllUsers);
router.get("/users", roleMiddleware(["ADMIN"]), userController.getAllUsers);
router.post("/users/addrole", roleMiddleware(["ADMIN"]), userController.addUserRole);
router.get("/", (req, res) => res.send("Conntection to API DCVS success!"));
router.get("/roles", authMiddleware, roleController.getAllRoles);
router.post("/users/delrole", roleMiddleware(["ADMIN"]), userController.delUserRole);
router.post("/users/del", roleMiddleware(["ADMIN"]), userController.delUser);

module.exports = router;
