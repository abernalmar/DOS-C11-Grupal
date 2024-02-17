import RepositoryBase from "../RepositoryBase.js";
import RestaurantMongoose from "./models/RestaurantMongoose.js";
import OrderMongoose from "./models/OrderMongoose.js";

class ProductRepository extends RepositoryBase {
  async findById(id) {
    try {
      const restaurant = await RestaurantMongoose.findOne({
        "products._id": id,
      }).populate("products.productCategory");
      return restaurant.products.id(id);
    } catch (err) {
      return null;
    }
  }

  async create(productData) {
    const restaurant = await RestaurantMongoose.findById(
      productData.restaurantId
    );
    restaurant.products.push(productData);
    await restaurant.save();
    return restaurant.products.at(-1); // last element of the array
  }

  async update(id, productData) {
    const restaurantUpdated = await RestaurantMongoose.findOneAndUpdate(
      { "products._id": id },
      {
        $set: {
          "products.$.name": productData.name,
          "products.$.description": productData.description,
          "products.$.image": productData.image,
          "products.$.availability": productData.availability,
          "products.$.order": productData.order,
          "products.$.price": productData.price,
          "products.$._productCategoryId": productData.productCategoryId,
        },
      },
      { new: true }
    ).populate("products.productCategory");
    return restaurantUpdated.products.id(id);
  }

  async destroy(id) {
    const restaurant = await RestaurantMongoose.findOne({ "products._id": id });
    restaurant.products.pull(id);
    const updatedRestaurant = await restaurant.save();
    return !updatedRestaurant.products.id(id);
  }

  async save(entity) {
    return await this.create(entity);
  }

  async show(id) {
    return this.findById(id);
  }

  async popular() {
    const top3Products = await OrderMongoose.aggregate([
      {
        $project: { products: 1, status: 1, _id: 0 },
      },
      {
        $unwind: { path: "$products" },
      },
      {
        $group: {
          _id: "$products._id",
          unitsSold: {
            $sum: "$products.quantity",
          },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 3 },
    ]);
    return Promise.all(
      top3Products.map(async (product) => {
        const fullProduct = await this.findById(product._id);
        fullProduct.unitsSold = product.unitsSold;
        return fullProduct;
      })
    );
  }

  async checkProductOwnership(productId, ownerId) {
    const restaurant = await RestaurantMongoose.findOne({
      "products._id": productId,
    });
    return ownerId === restaurant.userId.toString();
  }

  async checkProductRestaurantOwnership(restaurantId, ownerId) {
    const restaurant = await RestaurantMongoose.findById(restaurantId);
    return ownerId === restaurant.userId.toString();
  }

  async checkProductHasNotBeenOrdered(productId) {
    const orders = await OrderMongoose.find({ "products._id": productId });
    return orders.length === 0;
  }
}

export default ProductRepository;
