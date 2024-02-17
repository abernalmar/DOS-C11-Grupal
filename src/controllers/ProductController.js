import container from "../config/container.js";

class ProductController {
  constructor() {
    this.productService = container.resolve("productService");
    this.indexRestaurant = this.indexRestaurant.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.popular = this.popular.bind(this);
  }

  async indexRestaurant(req, res) {
    try {
      const products = await this.productService.indexRestaurant(
        req.params.restaurantId
      );
      res.json(products);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async show(req, res) {
    try {
      const product = await this.productService.show(req.params.productId);
      res.json(product);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async create(req, res) {
    try {
      const product = await this.productService.create(req.body);
      res.json(product);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async update(req, res) {
    try {
      const updatedProduct = await this.productService.update(
        req.params.productId,
        req.body
      );
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async destroy(req, res) {
    try {
      const result = await this.productService.destroy(req.params.productId);
      const message = result
        ? "Successfully deleted."
        : "Could not delete product.";
      res.json(message);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async popular(req, res) {
    try {
      const top3Products = await this.productService.popular();
      res.json(top3Products);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default ProductController;
