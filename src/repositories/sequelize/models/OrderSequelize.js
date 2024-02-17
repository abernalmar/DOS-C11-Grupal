import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class OrderSequelize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      const OrderProducts = sequelize.define('OrderProducts', {
        quantity: DataTypes.INTEGER,
        unityPrice: DataTypes.DOUBLE
      })

      OrderSequelize.belongsTo(models.RestaurantSequelize, { foreignKey: 'restaurantId', as: 'restaurant' })
      OrderSequelize.belongsTo(models.UserSequelize, { foreignKey: 'userId', as: 'user' })
      OrderSequelize.belongsToMany(models.ProductSequelize, { as: 'products', through: OrderProducts }, { onDelete: 'cascade' })
    }

    toJSON () {
      const attributes = Object.assign({}, this.get())
      if (this.dataValues.products) {
        attributes.products = this.dataValues.products.map(product => {
          const jsonProduct = product.toJSON()
          jsonProduct.quantity = product.quantity
          jsonProduct.unityPrice = product.unityPrice
          return jsonProduct
        })
      }
      for (const key in attributes) {
        if (attributes[key] === null) {
          attributes[key] = undefined
        }
      }
      return attributes
    }

    /* static createOrderProduct (id, createdAt, updatedAt, name, image, quantity, unityPrice) {
     return { id, createdAt, updatedAt, name, image, quantity, unityPrice }
   }

   /*bussinessEntity () {
     const orderedProducts = this.products?.map(product => OrderSequelize.createOrderProduct(product.id, product.createdAt, product.updatedAt, product.name, product.image, product.OrderProducts.quantity, product.OrderProducts.unityPrice))
     return new Order(this.id.toString(), this.createdAt ? this.createdAt : undefined, this.updatedAt ? this.updatedAt : undefined, this.startedAt ? this.startedAt : undefined, this.sentAt ? this.sentAt : undefined, this.deliveredAt ? this.deliveredAt : undefined, this.status, this.price, this.address, this.shippingCosts, this.restaurantId.toString(), this.userId.toString(), orderedProducts)
   } */

    getStatus () {
      if (this.deliveredAt) { return 'delivered' }
      if (this.sentAt) { return 'sent' }
      if (this.startedAt) { return 'in process' }
      return 'pending'
    }
  }
  OrderSequelize.init({
    createdAt: DataTypes.DATE,
    startedAt: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    deliveredAt: DataTypes.DATE,
    price: DataTypes.DOUBLE,
    address: DataTypes.STRING,
    shippingCosts: DataTypes.DOUBLE,
    restaurantId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.getStatus()
      }
    }
  }, {
    sequelize,
    modelName: 'Order'
  })
  OrderSequelize.addHook('afterFind', flattenOrderProducts)
  OrderSequelize.addHook('afterCreate', flattenOrderProducts)
  OrderSequelize.addHook('afterUpdate', flattenOrderProducts)

  return OrderSequelize
}

export default loadModel

const flattenOrderProducts = orders => {
  if (Array.isArray(orders)) {
    orders.forEach(order => {
      if (order.products) {
        order.products.forEach(product => {
          if (product.OrderProducts) {
            Object.assign(product, product.OrderProducts.get())
            delete product.OrderProducts
          }
        })
      }
    })
  } else if (orders && orders.products) {
    orders.products.forEach(product => {
      if (product.OrderProducts) {
        Object.assign(product, product.OrderProducts.get())
        delete product.OrderProducts
      }
    })
  }
}
