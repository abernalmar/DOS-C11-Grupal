import * as UserValidation from '../controllers/validation/UserValidation.js'
import UserController from '../controllers/UserController.js'
import container from '../config/container.js'
import RestaurantController from '../controllers/RestaurantController.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { addFilenameToBody, handleFileUpload } from '../middlewares/FileHandlerMiddleware.js'

const loadFileRoutes = function (app) {
  const userController = new UserController()
  const userService = container.resolve('userService')
  const restaurantController = new RestaurantController()
  const upload = handleFileUpload(['avatar'], process.env.AVATARS_FOLDER)

  app.route('/users')
    .put(
      isLoggedIn,
      upload,
      addFilenameToBody('avatar'),
      UserValidation.update,
      handleValidation,
      userController.update)
    .delete(
      isLoggedIn,
      userController.destroy)
  app.route('/users/register')
    .post(
      upload,
      addFilenameToBody('avatar'),
      UserValidation.create,
      handleValidation,
      userController.registerCustomer)
  app.route('/users/registerOwner')
    .post(
      upload,
      addFilenameToBody('avatar'),
      UserValidation.create,
      handleValidation,
      userController.registerOwner)
  app.route('/users/login')
    .post(
      UserValidation.login,
      handleValidation,
      userController.loginCustomer)
  app.route('/users/loginOwner')
    .post(
      UserValidation.login,
      handleValidation,
      userController.loginOwner
    )
  app.route('/users/isTokenValid')
    .put(userController.loginByToken)
  app.route('/users/myRestaurants')
    .get(
      isLoggedIn,
      hasRole('owner'),
      restaurantController.indexOwner
    )
  app.route('/users/:userId')
    .get(
      checkEntityExists(userService, 'userId'),
      isLoggedIn,
      userController.show)
}
export default loadFileRoutes
