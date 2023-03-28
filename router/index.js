const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");
const mailController = require("../controllers/mail-controller");
const roleController = require("../controllers/role-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");


router.post('/registration', 
	body("firstName").notEmpty(),
	body("lastName").notEmpty(),
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }), 
	userController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/activate/:link', mailController.activate);
router.get('/refresh', authController.refresh);
//router.get('/users', roleMiddleware(['USER']), userController.getAllUsers);
router.get('/users', roleMiddleware(['ADMIN']), userController.getAllUsers);
router.post('/role', roleMiddleware(['ADMIN']), roleController.addUserRole);
router.get("/", (req, res) => res.send("Conntection to API DCVS success!"));
router.get("/roles", authMiddleware, roleController.getAllRoles);

module.exports = router;