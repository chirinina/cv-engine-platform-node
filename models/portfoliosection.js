'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PortfolioSection.init({
    portfolioId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    content: DataTypes.JSON,
    order: DataTypes.INTEGER,
    isVisible: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PortfolioSection',
  });
  return PortfolioSection;
};