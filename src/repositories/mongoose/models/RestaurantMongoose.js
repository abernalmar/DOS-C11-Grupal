import mongoose, { Schema } from 'mongoose'
import moment from 'moment'
import ProductSchema from './ProductMongoose.js'
import OrderMongoose from './OrderMongoose.js'

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the restaurant name'
  },
  description: {
    type: String
  },
  address: {
    type: String,
    required: 'Kindly enter the restaurant name'
  },
  postalCode: {
    type: String,
    required: 'Kindly enter the restaurant postal code'
  },
  url: {
    type: String
  },
  shippingCosts: {
    type: Number,
    required: 'Kindly enter the shipping costs',
    min: 0
  },
  averageServiceMinutes: {
    type: Number
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  logo: {
    type: String
  },
  heroImage: {
    type: String
  },
  status: {
    type: String,
    enum: [
      'online',
      'offline',
      'closed',
      'temporarily closed'
    ]
  },
  _restaurantCategoryId: {
    type: Schema.Types.ObjectId,
    required: 'Kindly select the restaurant category',
    ref: 'RestaurantCategory'
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required: 'Kindly select the restaurant owner',
    ref: 'User'
  },
  products: [ProductSchema]
}, {
  virtuals: {
    userId: {
      get () { return this._userId.toString() },
      set (userId) { this._userId = userId }
    },
    restaurantCategoryId: {
      get () { return this._restaurantCategoryId.toString() },
      set (restaurantCategoryId) { this._restaurantCategoryId = restaurantCategoryId }
    }
  },
  methods: {
    async getAverageServiceTime () {
      try {
        const restaurantOrders = await OrderMongoose.find({ _restaurantId: this.id })
        const serviceTimes = restaurantOrders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
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
      delete resultObject._restaurantCategoryId
      return resultObject
    }
  }
})
restaurantSchema.virtual('restaurantCategory', {
  ref: 'RestaurantCategory',
  localField: '_restaurantCategoryId',
  foreignField: '_id'
})
const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants')
export default restaurantModel
