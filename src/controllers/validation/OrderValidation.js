import { check } from 'express-validator'
import container from '../../config/container.js'

const checkProductsAvailability = async (value, { req }) => {
  const orderService = container.resolve('orderService')
  try {
    const productsAreAvailable = await orderService.areProductsAvailable(req.body, value, req.params.orderId)
    if (productsAreAvailable) {
      return Promise.resolve('Products are available')
    } else {
      return Promise.reject(new Error('Some products are not available'))
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const checkProductsBelongToSameRestaurant = async (value, { req }) => {
  const orderService = container.resolve('orderService')
  try {
    const belongsToSameRestaurant = await orderService.productsBelongToSameRestaurant(req.body, value, req.params.orderId)
    if (belongsToSameRestaurant) {
      return Promise.resolve('Products ok')
    } else {
      return Promise.reject(new Error('Some products do not belong to the order restaurant'))
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const checkProductsBelongToSameRestaurantAsSavedOrder = async (value, { req }) => {
  const orderService = container.resolve('orderService')
  try {
    const belongsToSameRestaurantAsSavedOrder = await orderService.productsBelongToSameRestaurantAsSavedOrder(value, req.params.orderId)
    if (belongsToSameRestaurantAsSavedOrder) {
      return Promise.resolve('Products ok')
    } else {
      return Promise.reject(new Error('Some products do not belong to the original order restaurant'))
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const create = [
  check('restaurantId').exists({ checkFalsy: true }),
  check('address').exists({ checkFalsy: true }),
  check('products').exists().isArray({ min: 1 }).withMessage('Order should have products'),
  check('products.*.quantity').exists().isInt({ min: 1 }).withMessage('The quantity of the ordered products must be greater than zero').toInt(),
  check('products').custom(checkProductsBelongToSameRestaurant),
  check('products').custom(checkProductsAvailability)
]
const update = [
  check('restaurantId').not().exists(),
  check('address').exists({ checkFalsy: true }),
  check('products').exists().isArray({ min: 1 }).withMessage('Order should have products'),
  check('products.*.quantity').exists().isInt({ min: 1 }).withMessage('The quantity of the ordered products must be greater than zero').toInt(),
  check('products').custom(checkProductsBelongToSameRestaurantAsSavedOrder),
  check('products').custom(checkProductsAvailability)
]

export { create, update }
