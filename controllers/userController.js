const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../auth");
const bcrypt = require("bcrypt");

module.exports.registerUser = (reqBody) => {
	let newUser = new User({
		email: reqBody.email,
		isAdmin: reqBody.isAdmin,
		password: bcrypt.hashSync(reqBody.password, 10)
	});

	return newUser.save().then((user, error) => {
		if(error){
			return false
		} else {
			return true
		}
	})
}


module.exports.loginUser = (reqBody) => {
	return User.findOne({ email: reqBody.email }).then(result => {
		if(result == null){
			return "false";
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password)
			if(isPasswordCorrect){
				return { access: auth.createAccessToken(result) }
			} else {
				return false
			};
		};
	});
};

module.exports.setAsAdmin = (reqParams) => {
    return User.findById(reqParams.userId)
        .then((userFound) => {
            if (!userFound) {
                return false;
            } else {
                userFound.isAdmin = true;
                return userFound.save() 
                    .then((updatedUser) => {
                        return true;
                    })
                    .catch((error) => {
                        return false;
                    });
            }
        })
        .catch((error) => {
            console.error("Error setting user as admin:", error);
            return false;
        });
};



module.exports.getUserOrders = async (token) => {
    let decodedToken = auth.decode(token);
    try {
        const userFound = await User.findById(decodedToken.id);
        if (!userFound) {
            return false;
        } else {
            const userOrders = [];

            for (const orderData of userFound.orderedProducts) {
                for (const productData of orderData.products) {
                    const product = await Product.findById(productData.productId);
                    const newOrderedProduct = {
                        //productId: productData.productId,
                        productName: productData.productName,
                        quantity: productData.quantity,
                        amount: productData.quantity * product.price
                    };
                    userOrders.push(newOrderedProduct);
                }
            }

            return userOrders;
        }
    } catch (error) {
        console.error("Error retrieving user orders:", error);
        return false;
    }
};



module.exports.addProductToUser = async (userId, userIsAdmin, productData) => {
	if(!userIsAdmin){
	    try {
		    const productFound = await Product.findById(productData.productId);
		    if (!productFound) {
		        console.log("Product not found for productId:", productData.productId);
		        return false;
		    } else {
		        const userFound = await User.findById(userId);
		        if (!userFound) {
		            console.log("User not found for userId:", userId);
		            return false;
		        } else {
			        const totalPrice = productData.quantity * productFound.price;

			        const newOrderedProduct = {
			            productId: productData.productId,
			            productName: productFound.name,
			            quantity: productData.quantity
		        	};

			        userFound.orderedProducts.push({
			            products: [newOrderedProduct],
			            totalAmount: totalPrice
			        });

			        const updatedUser = await userFound.save();
			        return true;
		        }
		    }
		} catch (error) {
		    console.error("Error adding product to user:", error);
		    return false;
		}
	} else {
		console.error("This function is not available for the admin users");
		return false;
	}
};


module.exports.addToCart = async (userId, productData) => {
  try {
    const productFound = await Product.findById(productData.productId);
    if (!productFound) {
      console.log("Product not found for productId:", productData.productId);
      return false;
    }

    const totalPrice = productFound.price * productData.quantity;

    const newCartedProduct = {
      productId: productData.productId,
      productName: productFound.name,
      productImage: productFound.image,
      quantity: productData.quantity,
    };

    const userFound = await User.findById(userId);
    if (!userFound) {
      console.log("User not found for userId:", userId);
      return false;
    }

    // Check if the product already exists in the cart and update its quantity and total price
    const existingProductIndex = userFound.cartedProducts.findIndex(
      (product) => product.productId === productData.productId
    );

    if (existingProductIndex !== -1) {
      userFound.cartedProducts[existingProductIndex].quantity += productData.quantity;
      userFound.cartedProducts[existingProductIndex].totalAmount += totalPrice; // Update total amount
    } else {
      userFound.cartedProducts.push({
        addedOn: new Date(),
        products: [newCartedProduct], // Include the newCartedProduct
        totalAmount: totalPrice
      });
    }

    await userFound.save();
    return true;
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    return false;
  }
};

module.exports.moveProductsToOrdered = async (userId) => {
  try {
    const userFound = await User.findById(userId);
    if (!userFound) {
      console.log("User not found for userId:", userId);
      return false;
    } else {
      if (userFound.cartedProducts.length === 0) {
        console.log("No products in the cart to move.");
        return false;
      }
      
      userFound.orderedProducts.push(...userFound.cartedProducts);
      userFound.cartedProducts = [];

      await userFound.save();
      return true;
    }
  } catch (error) {
    console.error("Error moving products to ordered:", error);
    return false;
  }
};


module.exports.getUserDetails = (UserId) => {
    return User.findById(UserId.userId)
        .then((userFound) => {
            if (!userFound) {
                return false;
            } else {
                console.log('User found:', userFound);
                return userFound;
            }
        })
        .catch((error) => {
            console.error("Error retrieving user details:", error);
            return false;
        });
};




module.exports.getAllOrders = async (reqParams) => {
    const userIsAdmin = auth.decode(reqParams).isAdmin;
    if(!userIsAdmin){
    	return false;
    } else {
    	 try {
            const allUsers = await User.find();

            const allOrders = [];
            allUsers.forEach((user) => {
                user.orderedProducts.forEach((orderData) => {
                    orderData.products.forEach((productData) => {
                        const newOrderedProduct = {
                            userId: user._id,
                            userEmail: user.email,
                            productId: productData.productId,
                            productName: productData.productName,
                            quantity: productData.quantity,
                            amount: productData.quantity * productData.price
                        };
                        allOrders.push(newOrderedProduct);
                    });
                });
            });

            return allOrders;
        } catch (error) {
            console.error("Error retrieving all orders:", error);
            return false;
        }
    }
};

//New Controller
module.exports.getProfile = (data) => {
    return User.findOne({ id: data._id }).then(result => {
        if(result == null){
            return false;
        } else {
            result.password = "";
            return result;
        };
    });
};

module.exports.checkEmailExists = async (reqBody) => {
    try {
        const result = await User.find({ email: reqBody.email });

        if (result.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking email:', error);
        throw error;
    }
};

