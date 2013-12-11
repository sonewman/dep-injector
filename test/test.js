var test = require('tap').test
  , DepInjector = require('../');


test('test dependencies are injected into function', function (t) {
  var inj = new DepInjector({ a: 'a', b: 'b', c: 'c' })
  
  inj.bindFn(function (a, b, c) {
    t.equals(a, 'a');
    t.equals(b, 'b');
    t.equals(c, 'c');
    t.end();
  })();

});

test('only specified dependencies should be injected, and in any order', function (t) {
  var inj = new DepInjector({ a: 'a', b: 'b', c: 'c', d: 1, e: 2, f: 3 })
  
  inj.bindFn(function (b, f, a) {
    t.equals(b, 'b');
    t.equals(f, 3);
    t.equals(a, 'a');
    t.end();
  })();
});