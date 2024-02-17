
import RepositoryBase from '../RepositoryBase.js'
import RestaurantCategoryMongoose from './models/RestaurantCategoryMongoose.js'

class RestaurantCategoryRepository extends RepositoryBase {
  async findAll (...args) {
    return RestaurantCategoryMongoose.find()
  }
}

export default RestaurantCategoryRepository
