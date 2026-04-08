"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PortfolioInquiry extends Model {
    static associate(models) {
      PortfolioInquiry.belongsTo(models.Portfolio, {
        foreignKey: "portfolioId",
        as: "portfolio",
      });
    }
  }

  PortfolioInquiry.init(
    {
      portfolioId: DataTypes.INTEGER,
      senderName: DataTypes.STRING,
      projectName: DataTypes.STRING,
      projectDescription: DataTypes.TEXT,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PortfolioInquiry",
      tableName: "PortfolioInquiries",
    },
  );

  return PortfolioInquiry;
};
