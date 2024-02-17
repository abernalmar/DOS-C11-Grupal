import * as RestaurantValidation from '../controllers/validation/RestaurantValidation.js'
import RestaurantController from '../controllers/RestaurantController.js'
import ProductController from '../controllers/ProductController.js'
import OrderController from '../controllers/OrderController.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import { addFilenameToBody, handleFileUpload } from '../middlewares/FileHandlerMiddleware.js'
import container from '../config/container.js'

const loadFileRoutes = function (app) {
  const restaurantController = new RestaurantController()
  const productController = new ProductController()
  const orderController = new OrderController()
  const upload = handleFileUpload(['logo', 'heroImage'], process.env.RESTAURANTS_FOLDER)

  const restaurantService = container.resolve('restaurantService')
  app.route('/restaurants')
    .get(
      restaurantController.index)
    .post(
      isLoggedIn,
      hasRole('owner'),
      upload,
      addFilenameToBody('logo', 'heroImage'),
      RestaurantValidation.create,
      handleValidation,
      restaurantController.create)

  app.route('/restaurants/:restaurantId')
    .get(
      checkEntityExists(restaurantService, 'restaurantId'),
      restaurantController.show)
    .put(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(restaurantService, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      upload,
      addFilenameToBody('logo', 'heroImage'),
      RestaurantValidation.update,
      handleValidation,
      restaurantController.update)
    .delete(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(restaurantService, 'restaurantId'),
      RestaurantMiddleware.restaurantHasOrders,
      RestaurantMiddleware.checkRestaurantOwnership,
      restaurantController.destroy)

  app.route('/restaurants/:restaurantId/orders')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(restaurantService, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      orderController.indexRestaurant)

  app.route('/restaurants/:restaurantId/products')
    .get(
      checkEntityExists(restaurantService, 'restaurantId'),
      productController.indexRestaurant)

  app.route('/restaurants/:restaurantId/analytics')
    .get(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(restaurantService, 'restaurantId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      orderController.analytics)
}
export default loadFileRoutes
