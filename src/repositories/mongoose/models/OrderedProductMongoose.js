import { Schema } from 'mongoose'

const orderedProductSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the ordered product'
  },
  image: {
    type: String
  },
  quantity: {
    type: Number,
    required: 'Kindly enter the quantity of the ordered product'
  },
  unityPrice: {
    type: Number,
    required: 'Kindly enter the unityPrice of the ordered product'
  }

}, { strict: false, timestamps: true, toJSON: { virtuals: true } })

export default orderedProductSchema
