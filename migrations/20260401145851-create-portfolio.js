"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Portfolios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      templateId: {
        type: Sequelize.INTEGER,
      },
      slug: {
        type: Sequelize.STRING,
      },
      primaryColor: {
        type: Sequelize.STRING,
      },
      secondaryColor: {
        type: Sequelize.STRING,
      },
      fontFamily: {
        type: Sequelize.STRING,
      },
      secondaryTextColor: {
        type: Sequelize.STRING,
      },
      logoUrl: {
        type: Sequelize.STRING,
      },
      logoPosition: {
        type: Sequelize.STRING,
      },
      profession: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      socialLinks: {
        type: Sequelize.JSON,
      },
      courses: {
        type: Sequelize.JSON,
      },
      projects: {
        type: Sequelize.JSON,
      },
      experience: {
        type: Sequelize.JSON,
      },
      skills: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Portfolios");
  },
};
