import container from "../config/container.js";
import { processFileUris } from "./FileService.js";

class ProductService {
  constructor() {
    this.productRepository = container.resolve("productRepository");
    this.restaurantRepository = container.resolve("restaurantRepository");
  }

  // FIXME: Rename method
  async indexRestaurant(restaurantId) {
    const restaurant = await this.restaurantRepository.show(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    restaurant.products = restaurant.products.map((product) => {
      processFileUris(product, ["image"]);
      return product;
    });
    return restaurant.products;
  }

  async create(data) {
    const newProduct = await this.productRepository.create(data);
    processFileUris(newProduct, ["image"]);
    return newProduct;
  }

  async show(id) {
    const product = await this.productRepository.show(id);
    if (!product) {
      throw new Error("Product not found");
    }
    processFileUris(product, ["image"]);

    return product;
  }

  async update(id, data) {
    const product = await this.productRepository.update(id, data);
    if (!product) {
      throw new Error("Product not found");
    }
    processFileUris(product, ["image"]);
    return product;
  }

  async destroy(id) {
    const result = await this.productRepository.destroy(id);
    if (!result) {
      throw new Error("Product not found");
    }
    return true;
  }

  async popular() {
    let topProducts = await this.productRepository.popular();
    topProducts = topProducts.map((product) => {
      processFileUris(product, ["image"]);
      return product;
    });
    return topProducts;
  }

  async exists(id) {
    return await this.productRepository.findById(id);
  }

  async checkProductOwnership(productId, ownerId) {
    return await this.productRepository.checkProductOwnership(
      productId,
      ownerId
    );
  }

  async checkProductRestaurantOwnership(restaurantId, ownerId) {
    return await this.productRepository.checkProductRestaurantOwnership(
      restaurantId,
      ownerId
    );
  }

  async checkProductHasNotBeenOrdered(productId) {
    return await this.productRepository.checkProductHasNotBeenOrdered(
      productId
    );
  }
}

export default ProductService;
