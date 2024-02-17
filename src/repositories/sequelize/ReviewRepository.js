import RepositoryBase from "../RepositoryBase.js";
import { ReviewSequelize } from "./models/models.js";

class ReviewRepository extends RepositoryBase {
  async findById(id, ...args) {
    return ReviewSequelize.findByPk(id);
  }

  async createReview(productId, reviewData, ...args) {
    reviewData.productId = productId;
    return ReviewSequelize.create(reviewData);
  }

  async updateReview(productId, reviewId, reviewData, ...args) {
    const review = await ReviewSequelize.findOne({
      where: { id: reviewId, productId: productId },
    });
    if (!review) {
      throw new Error("Review not found");
    }
    await review.update(reviewData);
    return review;
  }

  async destroyReview(productId, reviewId, ...args) {
    const result = await ReviewSequelize.destroy({
      where: { id: reviewId, productId: productId },
    });
    return result === 1;
  }

  async exists(id) {
    return ReviewSequelize.findByPk(id);
  }
}

export default ReviewRepository;
