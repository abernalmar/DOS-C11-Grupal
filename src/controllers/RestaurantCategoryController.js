
import container from '../config/container.js'
class RestaurantCategoryController {
  constructor () {
    this.restaurantCategoryService = container.resolve('restaurantCategoryService')
    this.index = this.index.bind(this)
  }

  async index (req, res) {
    try {
      const restaurantCategories = await this.restaurantCategoryService.index()
      res.json(restaurantCategories)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}
export default RestaurantCategoryController
