import container from '../config/container.js'

class ProductCategoryController {
  constructor () {
    this.productCategoryService = container.resolve('productCategoryService')
    this.index = this.index.bind(this)
  }

  async index (req, res) {
    try {
      const productCategories = await this.productCategoryService.index()
      res.json(productCategories)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}
export default ProductCategoryController
