
import container from '../config/container.js'

const checkOrderOwnership = async (req, res, next) => {
  const orderService = container.resolve('orderService')
  try {
    const result = await orderService.checkOrderOwnership(req.params.orderId, req.user.id)
    if (result) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This order does not belong to any of your restaurants')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkOrderCustomer = async (req, res, next) => {
  const orderService = container.resolve('orderService')

  try {
    const result = await orderService.checkOrderCustomer(req.params.orderId, req.user.id)
    if (result) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This order does not belong to you')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

const checkOrderIsPending = async (req, res, next) => {
  const orderService = container.resolve('orderService')
  try {
    const isPending = await orderService.isOrderPending(req.params.orderId)
    if (isPending) {
      return next()
    } else {
      return res.status(409).send('The order has already been started')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkOrderCanBeSent = async (req, res, next) => {
  const orderService = container.resolve('orderService')
  try {
    const isShippable = await orderService.isOrderShippable(req.params.orderId)
    if (isShippable) {
      return next()
    } else {
      return res.status(409).send('The order cannot be sent')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
const checkOrderCanBeDelivered = async (req, res, next) => {
  const orderService = container.resolve('orderService')
  try {
    const isDeliverable = await orderService.isOrderDeliverable(req.params.orderId)
    if (isDeliverable) {
      return next()
    } else {
      return res.status(409).send('The order cannot be delivered')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkRestaurantExists = async (req, res, next) => {
  const restaurantService = container.resolve('restaurantService')
  const orderService = container.resolve('orderService')
  try {
    const restaurant = await restaurantService.exists(await orderService.getRestaurantIdOfOrder(req.body, req.params.orderId))
    if (restaurant) {
      return next()
    } else {
      return res.status(409).send('Restaurant does not exist')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkOrderOwnership, checkOrderCustomer, checkOrderVisible, checkOrderIsPending, checkOrderCanBeSent, checkOrderCanBeDelivered, checkRestaurantExists }
