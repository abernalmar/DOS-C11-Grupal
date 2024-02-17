import mongoose from 'mongoose'
import moment from 'moment'
import RepositoryBase from '../RepositoryBase.js'
import OrderMongoose from './models/OrderMongoose.js'

class OrderRepository extends RepositoryBase {
  async findById (id) {
    try {
      return OrderMongoose.findById(id)
    } catch (err) {
      return null
    }
  }

  async findByRestaurantId (restaurantId, paginated = false, page = 1, limit = 10) {
    if (paginated) {
      return await this.#findByRestaurantIdPaginated(page, limit, restaurantId)
    } else {
      return OrderMongoose.find({ _restaurantId: restaurantId })
    }
  }

  async #findByRestaurantIdPaginated (page, limit, restaurantId) {
    const skip = (page - 1) * limit
    const orders = await OrderMongoose.find({ _restaurantId: restaurantId })
      .sort('created_at')
      .skip(skip)
      .limit(limit)
    const total = await OrderMongoose.countDocuments({ _restaurantId: restaurantId })
    return {
      items: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async indexCustomer (customerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const orders = await OrderMongoose.find({ _userId: customerId })
      .sort('created_at')
      .skip(skip)
      .limit(limit)
      .populate('restaurant')
    const total = await OrderMongoose.countDocuments({ _userId: customerId })
    return {
      items: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  formatOrderProducts (orderData) {
    return orderData.products.map(orderDataProductDTO => {
      return {
        name: orderDataProductDTO.name,
        image: orderDataProductDTO.image,
        quantity: orderDataProductDTO.quantity,
        unityPrice: orderDataProductDTO.unityPrice,
        _id: orderDataProductDTO.id
      }
    })
  }

  async create (orderData) {
    orderData.products = this.formatOrderProducts(orderData)
    const newOrderMongoose = new OrderMongoose(orderData)
    return newOrderMongoose.save()
  }

  async update (id, orderData) {
    orderData.products = this.formatOrderProducts(orderData)
    return OrderMongoose.findByIdAndUpdate(id, orderData, { new: true })
  }

  async destroy (id) {
    const deletedResult = await OrderMongoose.findByIdAndDelete(id)
    return deletedResult !== null
  }

  async save (entity) {
    entity.products.forEach(product => { product._id = product.id ? product.id : product._id })
    return OrderMongoose.findByIdAndUpdate(entity.id, entity, { upsert: true, new: true })
  }

  async analytics (restaurantId) {
    const yesterdayZeroHours = moment().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const todayZeroHours = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const numYesterdayOrders = (await OrderMongoose.find({
      createdAt: {
        $lt: todayZeroHours,
        $gte: yesterdayZeroHours
      },
      restaurantId: new mongoose.Types.ObjectId(restaurantId)
    })).length
    const numPendingOrders = (await OrderMongoose.find({
      startedAt: { $exists: false },
      restaurantId: new mongoose.Types.ObjectId(restaurantId)
    })).length
    const numDeliveredTodayOrders = (await OrderMongoose.find({
      deliveredAt: { $gte: todayZeroHours },
      restaurantId: new mongoose.Types.ObjectId(restaurantId)
    })).length

    const invoicedToday = (await OrderMongoose.aggregate([
      {
        $match: {
          startedAt: { $gte: new Date(todayZeroHours) },
          restaurantId: new mongoose.Types.ObjectId(restaurantId)
        }
      },
      {
        $group: {
          _id: 'null',
          invoicedToday: {
            $sum: '$price'
          }
        }
      },
      { $project: { _id: 0 } }
    ]))?.[0]?.invoicedToday
    return { restaurantId, numYesterdayOrders, numPendingOrders, numDeliveredTodayOrders, invoicedToday }
  }
}
export default OrderRepository
