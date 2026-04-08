"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    static associate(models) {
      Portfolio.hasMany(models.PortfolioInquiry, {
        foreignKey: "portfolioId",
        as: "inquiries",
      });
    }
  }
  Portfolio.init(
    {
      userId: DataTypes.INTEGER,
      templateId: DataTypes.INTEGER,
      slug: DataTypes.STRING,
      primaryColor: DataTypes.STRING,
      secondaryColor: DataTypes.STRING,
      fontFamily: DataTypes.STRING,
      secondaryTextColor: DataTypes.STRING,
      logoUrl: DataTypes.STRING,
      logoPosition: DataTypes.STRING, // 'left', 'center', 'right', 'top', etc.
      profession: DataTypes.STRING,
      location: DataTypes.STRING,
      email: DataTypes.STRING,
      socialLinks: DataTypes.JSON, // { linkedin, twitter, github, ... }
      courses: DataTypes.JSON, // [{ name, institution, year, description }]
      projects: DataTypes.JSON, // [{ name, description, link, tools, images }]
      experience: DataTypes.JSON, // [{ company, role, period, description, tools }]
      skills: DataTypes.JSON, // [{ name, level }]
    },
    {
      sequelize,
      modelName: "Portfolio",
    },
  );
  return Portfolio;
};
