const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");
const mailController = require("../controllers/mail-controller");
const roleController = require("../controllers/role-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");
const journalController = require("../controllers/journal-controller");

router.post(
  "/users/add",
  body("name").notEmpty(),
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
router.get("/journal/nodes", authMiddleware, journalController.getAllNodes);
router.post("/journal/delnode", roleMiddleware(["ADMIN"]), journalController.delNode);
router.post("/journal/addnode", roleMiddleware(["ADMIN"]), journalController.addNode);
router.get("/journal/areas", authMiddleware, journalController.getAllAreas);
router.post("/journal/delarea", roleMiddleware(["ADMIN"]), journalController.delArea);
router.post("/journal/addarea", roleMiddleware(["ADMIN"]), journalController.addArea);
router.post("/journal/editarea", roleMiddleware(["ADMIN"]), journalController.editArea);

module.exports = router;
