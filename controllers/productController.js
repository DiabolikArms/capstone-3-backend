const Product = require("../models/Product");
const auth = require("../auth");
const bcrypt = require("bcrypt");

module.exports.createProduct = (data) => {

	console.log(data);

	if(data.isAdmin){
		let newProduct = new Product({
			id: data.product.id,
			name: data.product.name,
			company: data.product.company,
			price: data.product.price,
			image: data.product.image,
			description: data.product.description,
			category: data.product.category,
			isActive: data.product.isActive,
			buyers: [],
		  });

		return newProduct.save().then((product, error) => {
			if(error) {
				return false
			} else {
				return true
			}
		})
	}

	let message = Promise.resolve("Only an admin can perform this activity.");
	return message.then((value) => {
		return value
	})

}

module.exports.getAllProducts = () => {
	return Product.find({}).then(result => {
		return result;
	});
};

module.exports.activeProducts = () => {
	return Product.find({isActive: true}).then(result => {
		return result;
	});
};

module.exports.getProduct = (reqParams) => {
	return Product.findById(reqParams.productId).then(result => {
		return result;
	});
};

module.exports.updateProduct = (reqParams, data) => {
	if(data.isAdmin){
		let updatedProduct = {
			name: data.product.name,
			description: data.product.description,
			price: data.product.price
		};

		return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then((product, error) => {
			if (error){
				return false;
			} else {
				return true;
			};
		})
	}

	let message = Promise.resolve("Only an admin can perform this activity.");
	return message.then((value) => {
		return value
	})
};


module.exports.archiveProduct = (reqParams, data) => {
	if(data.isAdmin){
		let updateActiveField = {
			isActive: false
		};

		return Product.findByIdAndUpdate(reqParams.productId, updateActiveField).then((product, error) => {
	      if (error) {
	        return false;
	      } else {
	        return true;
	      }
	    });
	}

	let message = Promise.resolve("Only an admin can perform this activity.");
	return message.then((value) => {
		return value
	})
};

