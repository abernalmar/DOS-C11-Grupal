import OrderController from '../controllers/OrderController.js'
import * as OrderValidation from '../controllers/validation/OrderValidation.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as OrderMiddleware from '../middlewares/OrderMiddleware.js'
import container from '../config/container.js'

const loadFileRoutes = function (app) {
  const orderController = new OrderController()
  const orderService = container.resolve('orderService')
  app.route('/orders')
    .get(
      isLoggedIn,
      hasRole('customer'),
      orderController.indexCustomer)
    .post(
      isLoggedIn,
      hasRole('customer'),
      OrderMiddleware.checkRestaurantExists,
      OrderValidation.create,
      handleValidation,
      orderController.create
    )

  app.route('/orders/:orderId/confirm')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderIsPending,
      orderController.confirm)
  app.route('/orders/:orderId/send')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeSent,
      orderController.send)

  app.route('/orders/:orderId/deliver')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeDelivered,
      orderController.deliver)

  app.route('/orders/:orderId')
    .delete(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderCustomer,
      OrderMiddleware.checkOrderIsPending,
      orderController.destroy)
    .put(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderCustomer,
      OrderMiddleware.checkOrderIsPending,
      OrderValidation.update,
      handleValidation,
      orderController.update)
    .get(
      isLoggedIn,
      checkEntityExists(orderService, 'orderId'),
      OrderMiddleware.checkOrderVisible,
      orderController.show)
}

export default loadFileRoutes
