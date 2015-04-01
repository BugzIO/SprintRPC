module.exports = function(sequelize, t) {

  // Sprint
  // id
  // whiteboard
  // title
  // description
  // teamID
  // defaultComponent
  // dueDate
  // archived
  // createdAt
  // updatedAt

  return sequelize.define('Sprint', {
    params: t.STRING,
    title: {
      type: t.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    description: t.TEXT,
    defaultComponent: t.STRING,
    dueDate: t.DATE,
    archived: {
      type: t.BOOLEAN,
      default: 0
    },
    deletion: {
      type: t.BOOLEAN,
      default: 0
    }
  });
};
