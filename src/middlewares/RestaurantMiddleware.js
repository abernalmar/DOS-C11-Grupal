
import container from '../config/container.js'

const checkRestaurantOwnership = async (req, res, next) => {
  const restaurantService = container.resolve('restaurantService')
  try {
    const restaurant = await restaurantService.show(req.params.restaurantId)
    // eslint-disable-next-line eqeqeq
    if (restaurant.userId === req.user.id) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const restaurantHasOrders = async (req, res, next) => {
  const orderService = container.resolve('orderService')

  try {
    const restaurantOrders = await orderService.indexRestaurant(req.params.restaurantId)
    if (!restaurantOrders || restaurantOrders.length === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasOrders }
