import mongoose, { Schema } from 'mongoose'
import orderedProductSchema from './OrderedProductMongoose.js'

const orderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  price: {
    type: Number,
    required: 'Kindly enter de delivery address'
  },
  address: {
    type: String,
    required: 'Kindly enter de delivery address'
  },
  shippingCosts: {
    type: Number,
    required: 'Kindly enter de delivery address'
  },
  _restaurantId: {
    type: Schema.Types.ObjectId,
    required: 'Kindly select the restaurant owner',
    ref: 'Restaurant'
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required: 'Kindly select the restaurant owner',
    ref: 'User'
  },
  products: [orderedProductSchema]
}, {
  virtuals: {
    userId: {
      get () { return this._userId.toString() },
      set (userId) { this._userId = userId }
    },
    restaurantId: {
      get () { return this._restaurantId.toString() },
      set (restaurantId) { this._restaurantId = restaurantId }
    }
  },
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, resultObject, options) {
      delete resultObject._id
      delete resultObject.__v
      delete resultObject._userId
      delete resultObject._restaurantId
      return resultObject
    }
  }
})

orderSchema.virtual('status').get(function () {
  if (this.deliveredAt) { return 'delivered' }
  if (this.sentAt) { return 'sent' }
  if (this.startedAt) { return 'in process' }
  return 'pending'
})
orderSchema.virtual('restaurant', {
  ref: 'Restaurant',
  localField: '_restaurantId',
  foreignField: '_id'
})

const orderModel = mongoose.model('Order', orderSchema, 'orders')
export default orderModel
