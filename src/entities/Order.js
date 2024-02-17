import BaseEntity from './BaseEntity.js'

class Order extends BaseEntity {
  startedAt
  sentAt
  deliveredAt
  status
  price
  address
  shippingCosts
  restaurantId
  userId
  products
  constructor (id, createdAt, updatedAt, startedAt, sentAt, deliveredAt, status, price, address, shippingCosts, restaurantId, userId, products) {
    super(id, createdAt, updatedAt)
    this.startedAt = startedAt
    this.sentAt = sentAt
    this.deliveredAt = deliveredAt
    this.status = status
    this.price = price
    this.address = address
    this.shippingCosts = shippingCosts
    this.restaurantId = restaurantId
    this.userId = userId
    this.products = products
  }
}
class OrderedProduct extends BaseEntity {
  name
  image
  quantity
  unityPrice
  constructor (id, createdAt, updatedAt, name, image, quantity, unityPrice) {
    super(id, createdAt, updatedAt)
    this.name = name
    this.image = image
    this.quantity = quantity
    this.unityPrice = unityPrice
  }
}

export default Order
export { OrderedProduct }
