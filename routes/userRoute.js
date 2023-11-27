const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController	=> res.send(
		resultFromController));
});

router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(
		resultFromController));
});

router.put("/:userId/setAsAdmin", (req, res) => {
	userController.setAsAdmin(req.params).then(resultFromController => res.send(
		resultFromController));
});

router.get("/getUserOrders",auth.verify, (req, res) => {
	userController.getUserOrders(req.headers.authorization).then(resultFromController => res.send(
		resultFromController));
})

router.post("/checkout", auth.verify, (req, res) => {
    const userId = auth.decode(req.headers.authorization).id;
    const userIsAdmin = auth.decode(req.headers.authorization).isAdmin;
    const productData = req.body;
    userController.addProductToUser(userId, userIsAdmin, productData).then((resultFromController) => res.send(
    	resultFromController))
});

router.get("/getAllOrders",auth.verify, (req, res) => {
	userController.getAllOrders(req.headers.authorization).then(resultFromController => res.send(
		resultFromController));
})

router.get("/:userId/userDetails", (req, res) => {
    userController.getUserDetails(req.params).then(resultFromController => res.send(resultFromController));
});

router.post("/addToCart", auth.verify, (req, res) => {
  const userId = auth.decode(req.headers.authorization).id;
  const productData = req.body;
  userController.addToCart(userId, productData).then((resultFromController) => res.send(resultFromController));
});

router.post("/cartToCheckout", auth.verify, (req, res) => {
  const userId = auth.decode(req.headers.authorization).id;
  userController.moveProductsToOrdered(userId).then((resultFromController) => res.send(resultFromController));
});

// New Added route
router.get("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	userController.getUserDetails({userId: userData.id }).then(resultFromController => res.send(
		resultFromController));
});

router.post("/checkEmail", async (req, res) => {
    try {
        const emailExists = await userController.checkEmailExists(req.body);
        res.status(200).json({ emailExists });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'An error occurred while checking email.' });
    }
});

module.exports = router;