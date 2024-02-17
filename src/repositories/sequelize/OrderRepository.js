import moment from 'moment'
import { Op } from 'sequelize'
import RepositoryBase from '../RepositoryBase.js'
import { OrderSequelize, RestaurantSequelize, ProductSequelize, sequelizeSession } from './models/models.js'

class OrderRepository extends RepositoryBase {
  async findById (id, ...args) {
    return OrderSequelize.findByPk(id, {
      include: {
        model: ProductSequelize,
        as: 'products'
      }
    })
  }

  async findByRestaurantId (restaurantId, paginated = false, page = 1, limit = 10) {
    if (paginated) {
      return await this.#findByRestaurantIdPaginated(page, limit, restaurantId)
    } else {
      return OrderSequelize.findAll({
        where: { restaurantId },
        include: {
          model: ProductSequelize,
          as: 'products'
        }
      })
    }
  }

  async #findByRestaurantIdPaginated (page, limit, restaurantId) {
    const offset = (page - 1) * limit

    const orders = await OrderSequelize.findAll({
      where: { restaurantId },
      include: {
        model: ProductSequelize,
        as: 'products'
      },
      limit,
      offset
    })
    const total = await OrderSequelize.count({ where: { restaurantId } })
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
    const offset = (page - 1) * limit
    const orders = await OrderSequelize.findAll({
      where: {
        userId: customerId
      },
      include: [{
        model: ProductSequelize,
        as: 'products'
      },
      {
        model: RestaurantSequelize,
        as: 'restaurant',
        attributes: ['name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })
    const total = await OrderSequelize.count({ where: { userId: customerId } })
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

  async #saveOrderProducts (order, productLines, transaction) {
    const addProductLinesPromises = productLines.map(productLine => {
      return order.addProduct(productLine.id, { through: { quantity: productLine.quantity, unityPrice: productLine.unityPrice }, transaction })
    })
    return Promise.all(addProductLinesPromises)
  }

  async #saveOrderWithProducts (order, productLines, transaction) {
    const savedOrder = await order.save({ transaction })
    await this.#saveOrderProducts(savedOrder, productLines, transaction)
    const reloaded = await savedOrder.reload({ include: { model: ProductSequelize, as: 'products' }, transaction })
    return reloaded
  }

  formatOrderProducts (orderData) {
    return orderData.products.map(orderDataProductDTO => {
      return {
        name: orderDataProductDTO.name,
        image: orderDataProductDTO.image,
        quantity: orderDataProductDTO.quantity,
        unityPrice: orderDataProductDTO.unityPrice,
        id: orderDataProductDTO.id
      }
    })
  }

  async create (orderData, ...args) {
    let newOrder = OrderSequelize.build(orderData)
    const transaction = await sequelizeSession.transaction()
    try {
      newOrder = await this.#saveOrderWithProducts(newOrder, this.formatOrderProducts(orderData), transaction)
      await transaction.commit()
      return this.findById(newOrder.id)
    } catch (err) {
      await transaction.rollback()
      throw new Error(err)
    }
  }

  async update (id, orderData, ...args) {
    const transaction = await sequelizeSession.transaction()
    try {
      await OrderSequelize.update(orderData, { where: { id } }, { transaction })
      let updatedOrder = await OrderSequelize.findByPk(id)
      await updatedOrder.setProducts([], { transaction })
      updatedOrder = await this.#saveOrderWithProducts(updatedOrder, this.formatOrderProducts(orderData), transaction)
      await transaction.commit()
      return this.findById(updatedOrder.id)
    } catch (err) {
      await transaction.rollback()
      throw new Error(err)
    }
  }

  async destroy (id, ...args) {
    const result = await OrderSequelize.destroy({ where: { id } })
    return result === 1
  }

  async save (orderSequelize, ...args) {
    await orderSequelize.save()
    return this.findById()
  }

  async analytics (restaurantId) {
    const yesterdayZeroHours = moment().subtract(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const todayZeroHours = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const numYesterdayOrders = await OrderSequelize.count({
      where:
        {
          createdAt: {
            [Op.lt]: todayZeroHours,
            [Op.gte]: yesterdayZeroHours
          },
          restaurantId
        }
    })
    const numPendingOrders = await OrderSequelize.count({
      where:
        {
          startedAt: null,
          restaurantId
        }
    })
    const numDeliveredTodayOrders = await OrderSequelize.count({
      where:
        {
          deliveredAt: { [Op.gte]: todayZeroHours },
          restaurantId
        }
    })

    const invoicedToday = await OrderSequelize.sum(
      'price',
      {
        where:
          {
            startedAt: { [Op.gte]: todayZeroHours }, // FIXME: Created or confirmed?
            restaurantId
          }
      })
    return { restaurantId, numYesterdayOrders, numPendingOrders, numDeliveredTodayOrders, invoicedToday }
  }
}

export default OrderRepository
