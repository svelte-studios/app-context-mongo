module.exports = context => (Type, collection, eventsCollection) => {
  const _eventsCollection = eventsCollection || `${collection}Events`;

  return {
    load(args, { transaction } = {}) {
      const { $mongo } = context;

      return $mongo.then(({ db }) => {
        return db
          .collection(collection)
          .findOne(args, { session: transaction })
          .then(data => {
            if (!data) throw new Error('Aggregate not found');
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
        if (events.length) promises.push(db.collection(_eventsCollection).insert(events, { session: transaction }));
        return Promise.all(promises);
      });
    },

    create() {
      return Promise.resolve(new Type());
    },
  };
};
