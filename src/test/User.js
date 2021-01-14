class User {
  constructor(initValues = {}) {
    Object.assign(this, initValues);
  }

  _id = '';
  username = '';
}

//actions
User.prototype.createUser = function (context, { username }) {
  const event = { eventType: 'CREATED_USER', data: { username } };
  this.CREATED_USER(event);
  return event;
};

//mutations
User.prototype.CREATED_USER = function ({ data: { username } }) {
  this.username = username;
};

export default User;
