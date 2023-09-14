"use strict";
const bcrypt = require("bcryptjs");
const { User, sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Fetch users with id less than 9
      const users = await User.findAll({
        where: {
          id: {
            [Sequelize.Op.lt]: 9,
          },
        },
        transaction,
      });

      // Hash each user's password and update the user
      for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await queryInterface.bulkUpdate(
          "Users",
          { password: hashedPassword },
          { id: user.id },
          { transaction }
        );
      }

      // Commit the transaction if all operations succeed
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction if any operation fails
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverting commands here
  },
};
