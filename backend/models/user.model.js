module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "account",
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    }
  );

  return User;
};
