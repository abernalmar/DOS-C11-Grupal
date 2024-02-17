import mongoose from 'mongoose'
import RepositoryBase from '../RepositoryBase.js'
import RestaurantMongoose from './models/RestaurantMongoose.js'

class RestaurantRepository extends RepositoryBase {
  async findById (id, ...args) {
    try {
      const leanNeeded = args[0]?.lean
      if (leanNeeded) {
        return await RestaurantMongoose.findById(id).lean()
      }
      return await RestaurantMongoose.findById(id)
    } catch (err) {
      return null
    }
  }

  async findAll () {
    return RestaurantMongoose.find().populate('restaurantCategory')
  }

  async create (restaurantData) {
    return (new RestaurantMongoose(restaurantData)).save()
  }

  async update (id, restaurantData) {
    return RestaurantMongoose.findByIdAndUpdate(id, restaurantData, { new: true })
  }

  async destroy (id) {
    return (await RestaurantMongoose.findByIdAndDelete(id)) !== null
  }

  async save (entity) {
    return RestaurantMongoose.findByIdAndUpdate(entity.id, entity, { upsert: true, new: true })
  }

  async findByOwnerId (ownerId) {
    return RestaurantMongoose.find({ _userId: new mongoose.Types.ObjectId(ownerId) }).populate('restaurantCategory')
  }

  async show (id) {
    return RestaurantMongoose.findById(id).populate(['restaurantCategory', 'products.productCategory'])
  }

  async updateAverageServiceTime (restaurantId) {
    const restaurant = await RestaurantMongoose.findById(restaurantId)
    restaurant.averageServiceMinutes = await restaurant.getAverageServiceTime()
    return restaurant.save()
  }
}

export default RestaurantRepository
