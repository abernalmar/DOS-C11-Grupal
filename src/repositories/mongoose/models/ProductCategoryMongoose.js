import mongoose, { Schema } from 'mongoose'

const productCategorySchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the category'
  }
}, {
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, resultObject, options) {
      delete resultObject._id
      delete resultObject.__v
      return resultObject
    }
  }
})

const productCategoryModel = mongoose.model('ProductCategory', productCategorySchema, 'productcategories')
export default productCategoryModel
