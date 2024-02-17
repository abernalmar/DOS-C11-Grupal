
import RepositoryBase from '../RepositoryBase.js'
import { ProductCategorySequelize } from './models/models.js'

class ProductCategoryRepository extends RepositoryBase {
  async findAll (...args) {
    return ProductCategorySequelize.findAll()
  }
}

export default ProductCategoryRepository
