import User from './User';

export default {
  exec({ $mongo, Repository }, args) {
    return $mongo.then(() => {
      const repository = Repository(User, 'command_users');

      return repository.create().then(user => {
        user.username = args.username;
        return repository.save(user);
      });
    });
  },
};
