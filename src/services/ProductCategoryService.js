import container from '../config/container.js'

class ProductCategoryService {
  constructor () {
    this.productCategoryRepository = container.resolve('productCategoryRepository')
  }

  async index () {
    const productCategories = await this.productCategoryRepository.findAll()
    return productCategories
  }
}

export default ProductCategoryService
