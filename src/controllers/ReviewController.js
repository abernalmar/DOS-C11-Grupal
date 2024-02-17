import container from "../config/container.js";

class ReviewController {
  constructor() {
    this.reviewService = container.resolve("reviewService");
    this.showReview = this.showReview.bind(this);
    this.createReview = this.createReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.destroyReview = this.destroyReview.bind(this);
  }

  async showReview(req, res) {
    try {
      const review = await this.reviewService.findById(req.params.reviewId);
      res.json(review);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async createReview(req, res) {
    const newReviewData = req.body;
    newReviewData.userId = req.user.id;
    try {
      const review = await this.reviewService.createReview(
        req.params.productId,
        newReviewData
      );
      res.json(review);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async updateReview(req, res) {
    try {
      const updatedReview = await this.reviewService.updateReview(
        req.params.productId,
        req.params.reviewId,
        req.body
      );
      res.json(updatedReview);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async destroyReview(req, res) {
    try {
      const result = await this.reviewService.destroyReview(
        req.params.productId,
        req.params.reviewId
      );
      const message = result
        ? "Successfully deleted."
        : "Could not delete review.";
      res.json(message);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default ReviewController;
