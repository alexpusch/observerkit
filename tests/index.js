let testContext = require.context('.', false, /.+_test\.js/);

testContext.keys().forEach(function(key) {
  testContext(key);
});
