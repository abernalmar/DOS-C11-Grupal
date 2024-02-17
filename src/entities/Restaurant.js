import BaseEntity from './BaseEntity.js'

class Restaurant extends BaseEntity {
  name
  description
  address
  postalCode
  url
  shippingCosts
  averageServiceMinutes
  email
  phone
  logo
  heroImage
  status
  restaurantCategoryId
  restaurantCategory
  userId
  products

  constructor (id, createdAt, updatedAt, name, description, address, postalCode, url, shippingCosts, averageServiceMinutes, email, phone, logo, heroImage, status, restaurantCategoryId, restaurantCategory, userId, products = null) {
    super(id, createdAt, updatedAt)
    this.name = name
    this.description = description
    this.address = address
    this.postalCode = postalCode
    this.url = url
    this.shippingCosts = shippingCosts
    this.averageServiceMinutes = averageServiceMinutes
    this.email = email
    this.phone = phone
    this.logo = logo
    this.heroImage = heroImage
    this.status = status
    this.restaurantCategoryId = restaurantCategoryId
    this.restaurantCategory = restaurantCategory
    this.userId = userId
    this.products = products
  }
}

export default Restaurant
