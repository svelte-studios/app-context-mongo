module.exports = context => (Type, collection, eventsCollection) => {
  const _collection = collection ? collection : Type.collection;
  const _eventsCollection = eventsCollection || `${collection}Events`;

  return {
    load(args, { transaction } = {}) {
      const { $mongo } = context;

      return $mongo.then(({ db }) => {
        return db
          .collection(collection)
          .findOne(args, { session: transaction })
          .then(data => {
            if (!data) return undefined;
            data.lastUpdated = new Date(data.lastUpdated);
            return new Type(data);
          });
      });
    },

    save(agg, { session, transaction } = {}) {
      const { $mongo, $id } = context;
      return $mongo.then(({ db }) => {
        const promises = [];
        const events = session ? session.getEvents() : [];

        agg._id = agg._id || $id();
        agg.lastUpdated = new Date();

        promises.push(
          db.collection(collection).updateOne({ _id: agg._id }, { $set: agg }, { upsert: true, session: transaction })
        );
        if (events.length) promises.push(db.collection(_eventsCollection).insertMany(events, { session: transaction }));
        return Promise.all(promises);
      });
    },

    create() {
      return Promise.resolve(new Type());
    },
  };
};
