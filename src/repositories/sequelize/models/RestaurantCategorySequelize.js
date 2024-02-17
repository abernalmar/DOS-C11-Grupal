import { Model } from 'sequelize'
const loadModel = function (sequelize, DataTypes) {
  class RestaurantCategorySequelize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      RestaurantCategorySequelize.hasMany(models.RestaurantSequelize, { foreignKey: 'restaurantCategoryId' })
    }
  }
  RestaurantCategorySequelize.init({
    name: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'RestaurantCategory'
  })
  return RestaurantCategorySequelize
}
export default loadModel
