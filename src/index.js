const MongoClient = require('mongodb').MongoClient;

module.exports = (context, collections) => {
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

    return db
      .listCollections()
      .toArray()
      .then(list => {
        const missingCollections = collections.filter(c => !list.find(l => l.name === c));
        return Promise.all(missingCollections.map(mc => db.createCollection(mc)))
          .then(() => {
            return { db, client, BeginTransaction };
          })
          .catch(err => {
            $logger.error(err);
            throw new Error(err);
          });
      });
  });

  return $mongo;
};
