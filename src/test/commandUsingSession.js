import User from './User';

export default {
  exec({ $mongo, Session, Repository }, args) {
    return $mongo.then(({ BeginTransaction }) => {
      const repository = Repository(User, 'session_users');
      const session = Session();

      return repository.create().then(user => {
        return session.callAction(user, 'createUser', args).then(() =>
          BeginTransaction(transaction => {
            return repository.save(user, { session, transaction });
          })
        );
      });
    });
  },
};
