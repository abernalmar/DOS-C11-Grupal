import BaseEntity from "./BaseEntity.js";

class Product extends BaseEntity {
  name;
  description;
  price;
  image;
  order;
  availability;
  restaurantId;
  productCategoryId;
  productCategory;

  constructor(
    id,
    createdAt,
    updatedAt,
    name,
    description,
    price,
    image,
    order,
    availability,
    restaurantId,
    productCategoryId,
    productCategory = null
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.order = order;
    this.availability = availability;
    this.restaurantId = restaurantId;
    this.productCategoryId = productCategoryId;
    this.productCategory = productCategory;
  }
}

export default Product;
