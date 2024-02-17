import RestaurantCategoryController from '../controllers/RestaurantCategoryController.js'

const loadFileRoutes = function (app) {
  const restaurantCategoryController = new RestaurantCategoryController()
  app.route('/restaurantCategories')
    .get(restaurantCategoryController.index)
}
export default loadFileRoutes
