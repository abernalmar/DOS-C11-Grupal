import Sequelize from "sequelize";
import getEnvironmentConfig from "../../../config/config.js";
import loadRestaurantModel from "./RestaurantSequelize.js";
import loadOrderModel from "./OrderSequelize.js";
import loadProductModel from "./ProductSequelize.js";
import loadReviewModel from "./ReviewSequelize.js";
import loadProductCategoryModel from "./ProductCategorySequelize.js";
import loadRestaurantCategoryModel from "./RestaurantCategorySequelize.js";
import loadUserModel from "./UserSequelize.js";

const sequelizeSession = new Sequelize(
  getEnvironmentConfig().database,
  getEnvironmentConfig().username,
  getEnvironmentConfig().password,
  getEnvironmentConfig()
);
const RestaurantSequelize = loadRestaurantModel(
  sequelizeSession,
  Sequelize.DataTypes
);
const OrderSequelize = loadOrderModel(sequelizeSession, Sequelize.DataTypes);
const ProductSequelize = loadProductModel(
  sequelizeSession,
  Sequelize.DataTypes
);
const ProductCategorySequelize = loadProductCategoryModel(
  sequelizeSession,
  Sequelize.DataTypes
);
const RestaurantCategorySequelize = loadRestaurantCategoryModel(
  sequelizeSession,
  Sequelize.DataTypes
);
const UserSequelize = loadUserModel(sequelizeSession, Sequelize.DataTypes);
const ReviewSequelize = loadReviewModel(sequelizeSession, Sequelize.DataTypes);

const db = {
  RestaurantSequelize,
  OrderSequelize,
  ProductSequelize,
  ReviewSequelize,
  ProductCategorySequelize,
  RestaurantCategorySequelize,
  UserSequelize,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export {
  RestaurantSequelize,
  OrderSequelize,
  ProductSequelize,
  ReviewSequelize,
  ProductCategorySequelize,
  RestaurantCategorySequelize,
  UserSequelize,
  sequelizeSession,
};
