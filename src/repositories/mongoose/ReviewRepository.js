import RepositoryBase from "../RepositoryBase.js";
import ProductRepository from "./ProductRepository.js";
import RestaurantMongoose from "./models/RestaurantMongoose.js";

class ReviewRepository extends RepositoryBase {
  async findProductById(id) {
    try {
      const restaurant = await RestaurantMongoose.findOne({
        "products._id": id,
      }).populate("products.productCategory");
      return restaurant.products.id(id);
    } catch (err) {
      return null;
    }
  }
  async findById(id) {
    try {
      const restaurant = await RestaurantMongoose.findOne(
        { "products.reviews._id": id },
        { "products.reviews.$": 1 }
      );
      return restaurant.products[0].reviews.id(id);
    } catch (error) {
      return null;
    }
  }

  async createReview(productId, reviewData) {
    try {
      const updatedRestaurant = await RestaurantMongoose.findOneAndUpdate(
        { "products._id": productId },
        { $push: { "products.$.reviews": reviewData } },
        { new: true }
      );

      return updatedRestaurant.products.id(productId).reviews.pop();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create review");
    }
  }

  async updateReview(productId, reviewId, reviewData) {
    try {
      const updatedRestaurant = await RestaurantMongoose.findOneAndUpdate(
        { "products._id": productId, "products.reviews._id": reviewId },
        {
          $set: {
            "products.$[product].reviews.$[review].title": reviewData.title,
            "products.$[product].reviews.$[review].body": reviewData.body,
            "products.$[product].reviews.$[review].stars": reviewData.stars,
            "products.$[product].reviews.$[review].userId": reviewData.userId,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "product._id": productId },
            { "review._id": reviewId },
          ],
        }
      );

      // Encuentra el producto actualizado que contiene la revisión actualizada
      const updatedReview = updatedRestaurant.products
        .find((product) => product._id.toString() === productId)
        .reviews.find((review) => review._id.toString() === reviewId);
      return updatedReview;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update review");
    }
  }

  async destroyReview(productId, reviewId) {
    try {
      const updatedRestaurant = await RestaurantMongoose.findOneAndUpdate(
        { "products._id": productId },
        { $pull: { "products.$.reviews": { _id: reviewId } } },
        { new: true }
      );

      const updatedProduct = updatedRestaurant.products.id(productId);
      return !updatedProduct.reviews.id(reviewId);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to destroy review");
    }
  }
  async save(entity) {
    return await this.create(entity);
  }
}

export default ReviewRepository;
