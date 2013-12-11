module.exports = DepInjector;

/**
 * May dependency injector class
 * @param {Object} deps       object of dependencies
 * @param {Any}    context    global context that all bound functions are executed with
 */
function DepInjector (deps, context) {
  if (!(this instanceof DepInjector))
    return new DepInjector(deps, context);

  //  set internal mapping
  this._deps = 'object' === typeof deps ? deps : {};
  //  set context
  this._context = context || null;
}

/**
 * Add a single dependency
 * @param  {String} name   name identifier of depended
 * @param  {Any}    dep    the depended on
 * @return {This}          self
 */
DepInjector.prototype.addDep = function (name, dep) {
  this._deps[name] = dep;
  return this;
};


/**
 * Remove a single dependency
 * @param  {String} name  name identifier of depended
 * @return {This}         self
 */
DepInjector.prototype.removeDep = function (name) {
  if (name in this._deps) 
    delete this._deps[name];

  return this;
};

/**
 * Bind a function to the injectors dependency list
 * @param  {Function} fn        function to be bound
 * @param  {Object}   context   overruling context unless undefined
 * @return {Function}           bound function
 */
DepInjector.prototype.bindFn = function (fn, context) {
  var self = this, depNames = functionDeps(fn);

  return function () {
    var deps = [];
    depNames.forEach(function (name) {
      deps.push(self._deps[name]);
    });

    if (arguments.length > 0)
      deps = deps.concat([].slice.call(arguments))

    context = arguments.length === 2 ? context : this._context;
    return fn.apply(context, deps);
  };
};

/**
 * Match function argument dependencies
 * @type {RegExp}
 */
var ARGS_MATCH = /^function[^\(]*\(\s*([^\)]*)\)/;

/**
 * Return the expected dependencies
 * @param  {Function} fn  function to extract argument dependencies
 * @return {Array}        function argument dependencies
 */
function functionDeps (fn) {
  var matched = fn.toString().match(ARGS_MATCH);
  return matched ? matched[1].trim().split(/[\s,]+/) : [];
}