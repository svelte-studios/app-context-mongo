const MongoClient = require('mongodb').MongoClient;

export default context => {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs';
  const dbName = process.env.MONGO_DB || 'test';

  const $mongo = MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(client => {
    const db = client.db(dbName);

    const BeginTransaction = function (callback) {
      const { $logger } = context;
      const session = client.startSession();
      return session
        .withTransaction(() => callback(session))
        .then(() => {})
        .catch(err => {
          $logger.error(err);

          throw new Error('Transaction failed - Rolling back');
        });
    };

    return { db, client, BeginTransaction };
  });

  return $mongo;
};
