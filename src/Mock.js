module.exports = function () {
  $mongo = Promise.resolve({
    BeginTransaction: callback => {
      return callback();
    },
  });
  return $mongo;
};
