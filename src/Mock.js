export default function () {
  $mongo = Promise.resolve({
    CreateTransaction: callback => {
      return callback();
    },
  });
  return $mongo;
}
