const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Product ID is required."]
  },
  name: {
    type: String,
    required: [true, "Product name is required."]
  },
  company: {
    type: String,
    required: [true, "Company name is required."]
  },
  price: {
    type: Number,
    required: [true, "Price is required."]
  },
  image: {
    type: String,
    required: [true, "Image URL is required."]
  },
  description: {
    type: String,
    required: [true, "Description is required."]
  },
  category: {
    type: String,
    required: [true, "Category is required."]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  buyers: [
    {
      userId: {
        type: String,
        required: [true, "User ID is required."]
      },
      enrolledOn: {
        type: Date,
        default: new Date()
      }
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
