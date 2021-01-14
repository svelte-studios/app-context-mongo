import Mongo from '../index';
import Repository from '../Repository';

export default () => {
  const context = {};
  context.$logger = {
    error(err) {
      console.log(err);
      throw err;
    },
  };
  context.$id = () => 'testId';
  context.$mongo = Mongo(context);
  context.Repository = Repository(context);
  context.Session = fakeSession;
  return context;
};

const fakeSession = () => ({
  events: [],
  callAction(agg, method, args) {
    return Promise.resolve(this.events.push(agg[method](args)));
  },
  getEvents() {
    return this.events;
  },
});