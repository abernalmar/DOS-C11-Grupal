import RepositoryBase from "../RepositoryBase.js";
import {
  RestaurantSequelize,
  RestaurantCategorySequelize,
  ProductSequelize,
  ProductCategorySequelize,
  ReviewSequelize,
} from "./models/models.js";

class RestaurantRepository extends RepositoryBase {
  async findById(id, ...args) {
    return RestaurantSequelize.findByPk(id, {
      // attributes: { exclude: ['userId'] },
      include: [
        {
          model: ProductSequelize,
          as: "products",
          include: [
            { model: ProductCategorySequelize, as: "productCategory" },
            {
              model: ReviewSequelize,
              as: "reviews",
            },
          ],
        },

        {
          model: RestaurantCategorySequelize,
          as: "restaurantCategory",
        },
      ],
      order: [[{ model: ProductSequelize, as: "products" }, "order", "ASC"]],
    });
  }

  async findAll(...args) {
    return RestaurantSequelize.findAll({
      attributes: [
        "id",
        "name",
        "description",
        "address",
        "postalCode",
        "url",
        "shippingCosts",
        "averageServiceMinutes",
        "email",
        "phone",
        "logo",
        "heroImage",
        "status",
        "restaurantCategoryId",
      ],
      include: {
        model: RestaurantCategorySequelize,
        as: "restaurantCategory",
      },
      order: [
        [
          { model: RestaurantCategorySequelize, as: "restaurantCategory" },
          "name",
          "ASC",
        ],
      ],
    });
  }

  async create(restaurantData, ...args) {
    return new RestaurantSequelize(restaurantData).save();
  }

  async update(id, dataToUpdate, ...args) {
    const entity = await RestaurantSequelize.findByPk(id);
    entity.set(dataToUpdate);
    return entity.save();
  }

  async destroy(id, ...args) {
    const result = await RestaurantSequelize.destroy({ where: { id } });
    return result === 1;
  }

  async save(businessEntity, ...args) {
    return this.create(businessEntity);
  }

  async findByOwnerId(ownerId) {
    return RestaurantSequelize.findAll({
      attributes: { exclude: ["userId"] },
      where: { userId: ownerId },
      include: [
        {
          model: RestaurantCategorySequelize,
          as: "restaurantCategory",
        },
      ],
    });
  }

  async updateAverageServiceTime(restaurantId) {
    const restaurant = await RestaurantSequelize.findByPk(restaurantId);
    const averageServiceTime = await restaurant.getAverageServiceTime();
    await RestaurantSequelize.update(
      { averageServiceMinutes: averageServiceTime },
      { where: { id: restaurantId } }
    );
  }

  async show(id) {
    return this.findById(id);
  }
}

export default RestaurantRepository;
