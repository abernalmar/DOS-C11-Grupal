import { Model } from 'sequelize'
const loadModel = function (sequelize, DataTypes) {
  class ProductCategorySequelize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      ProductCategorySequelize.hasMany(models.ProductSequelize)
    }
  }
  ProductCategorySequelize.init({
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
    modelName: 'ProductCategory'
  })
  return ProductCategorySequelize
}
export default loadModel
