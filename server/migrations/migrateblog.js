module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Blogs", "blog_content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Blogs", "blog_content", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
