
import RepositoryBase from '../RepositoryBase.js'
import ProductCategoryMongoose from './models/ProductCategoryMongoose.js'

class ProductCategoryRepository extends RepositoryBase {
  async findAll (...args) {
    return ProductCategoryMongoose.find()
  }
}

export default ProductCategoryRepository
