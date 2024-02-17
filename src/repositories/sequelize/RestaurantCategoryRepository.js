
import RepositoryBase from '../RepositoryBase.js'
import { RestaurantCategorySequelize } from './models/models.js'

class RestaurantCategoryRepository extends RepositoryBase {
  async findAll (...args) {
    return RestaurantCategorySequelize.findAll()
  }
}

export default RestaurantCategoryRepository
