const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth-middleware");
const roleMiddleware = require("../middleware/role-middleware");

router.post('/registration', 
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }), 
	userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
//router.get('/users', roleMiddleware(['USER']), userController.getAllUsers);
router.get('/users', authMiddleware, userController.getAllUsers);
router.post('/role', roleMiddleware(['ADMIN']), userController.addRole);
router.get("/", (req, res) => res.send("Conntection to API DCVS success!"));

module.exports = router;