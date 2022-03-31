// refer：https://gist.github.com/subtleGradient/1052392
;(function () {
	if (typeof Object.getPrototypeOf != "function")(function(){

		Object.getPrototypeOf =
			(typeof "".__proto__ == "object")
			? function(object){
				return getPrototypeValue(object, '__proto__');
			}
			: function(object){
				return getPrototypeValue(object, 'constructor').prototype;
			}
		;


		function getPrototypeValue(object, propertyName){
			try{
				if (Object.prototype.hasOwnProperty.call(object, propertyName)){
					var ownValue = object[propertyName];
					delete object[propertyName];
				}
				return object[propertyName];
			}
			catch(e){throw e}
			finally{
				object[propertyName] = ownValue;
			}
		}

	}());
})();