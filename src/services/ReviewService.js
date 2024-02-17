import container from "../config/container.js";

class ReviewService {
  constructor() {
    this.reviewRepository = container.resolve("reviewRepository");
  }

  async createReview(productId, reviewData) {
    const newReview = await this.reviewRepository.createReview(
      productId,
      reviewData
    );
    return newReview;
  }

  async findById(reviewId) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error(" Service Review not found");
    }
    return review;
  }

  async updateReview(productId, reviewId, reviewData) {
    const updatedReview = await this.reviewRepository.updateReview(
      productId,
      reviewId,
      reviewData
    );
    return updatedReview;
  }

  async destroyReview(productId, reviewId) {
    const result = await this.reviewRepository.destroyReview(
      productId,
      reviewId
    );
    if (!result) {
      throw new Error("Review not found ");
    }
    return true;
  }

  async exists(id) {
    return await this.reviewRepository.findById(id);
  }
}

export default ReviewService;
