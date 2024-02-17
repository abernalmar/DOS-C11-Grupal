import mongoose, { Schema } from 'mongoose'
const restaurantCategorySchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the category'
  }
}, {
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    // @ts-ignore
    transform: function (doc, resultObject, options) {
      delete resultObject._id
      delete resultObject.__v
      return resultObject
    }
  }
})

const restaurantCategoryModel = mongoose.model('RestaurantCategory', restaurantCategorySchema, 'restaurantcategories')
export default restaurantCategoryModel
