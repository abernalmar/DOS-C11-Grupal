import ProductCategoryController from '../controllers/ProductCategoryController.js'

const loadFileRoutes = function (app) {
  const productCategoryController = new ProductCategoryController()

  app.route('/productCategories')
    .get(productCategoryController.index)
}
export default loadFileRoutes
