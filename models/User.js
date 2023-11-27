const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  orderedProducts: [
    {
      products: [
        {
          productId: {
            type: String
          },
          productName: {
            type: String
          },
          quantity: {
            type: Number
          },
          productImage: {
            type: String
          }
        }
      ],
      totalAmount: {
        type: Number
      },
      purchasedOn: {
        type: Date,
        default: new Date()
      }
    }
  ],
cartedProducts: [
    {
      products: [
        {
          productId: {
            type: String
          },
          productName: {
            type: String
          },
          quantity: {
            type: Number
          },
          productImage: {
            type: String
          }
        }
      ],
      totalAmount: {
        type: Number
      },
      addedOn: {
        type: Date,
        default: new Date()
      }
    }
  ],
});

module.exports = mongoose.model("User", userSchema);