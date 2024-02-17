import container from '../config/container.js'

class RestaurantCategoryService {
  constructor () {
    this.restaurantCategoryRepository = container.resolve('restaurantCategoryRepository')
  }

  async index () {
    const restaurantCategories = await this.restaurantCategoryRepository.findAll()
    return restaurantCategories
  }
}

export default RestaurantCategoryService
