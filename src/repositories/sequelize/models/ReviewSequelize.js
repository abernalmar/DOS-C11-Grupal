import { Model } from "sequelize";

const loadModel = function (sequelize, DataTypes) {
  class ReviewSequelize extends Model {
    static associate(models) {
      ReviewSequelize.belongsTo(models.ProductSequelize, {
        foreignKey: "productId",
        as: "product",
      });
      ReviewSequelize.belongsTo(models.UserSequelize, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  ReviewSequelize.init(
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      stars: DataTypes.FLOAT,
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );

  return ReviewSequelize;
};

export default loadModel;
