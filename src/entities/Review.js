import BaseEntity from "./BaseEntity.js";

class Review extends BaseEntity {
  title;
  body;
  stars;
  userId;

  constructor(id, createdAt, updatedAt, title, body, stars, userId) {
    super(id, createdAt, updatedAt);
    this.title = title;
    this.body = body;
    this.stars = stars;
    this.userId = userId;
  }
}

export default Review;
