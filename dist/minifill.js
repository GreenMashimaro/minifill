/*!
  * minifill.js v0.0.17 (https://thednp.github.io/minifill/)
  * Copyright 2015-2022 © thednp
  * Licensed under MIT (https://github.com/thednp/minifill/blob/master/LICENSE)
  */
 "use strict";
// Document
// HTMLDocument is an extension of Document.  
// If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.

if (!self.Document){ self.Document = self.HTMLDocument; }

if (!self.Window) {
  if (self.constructor) {
    self.Window = self.constructor;
  } else {
    (self.Window = self.constructor = new Function('return function Window() {}')()).prototype = self;
  }
}

// Element
if (!window.HTMLElement) { window.HTMLElement = window.Element; }

// Element
if (!window.Node) { window.Node = window.Element; }

// refer：https://gist.github.com/subtleGradient/1052392
(function () {
	if (typeof Object.getPrototypeOf != "function"){ (function(){

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

	}()); }
})();

// refer: https://github.com/RubyLouvre/object-defineproperty-ie8
var origDefineProperty = Object.defineProperty;

var arePropertyDescriptorsSupported = function() {
  var obj = {};
  try {
    origDefineProperty(obj, "x", { enumerable: false, value: obj });
    for (var _ in obj) {
      return false;
    }
    return obj.x === obj;
  } catch (e) {
    /* this is IE 8. */
    return false;
  }
};
var supportsDescriptors =
  origDefineProperty && arePropertyDescriptorsSupported();

if (!supportsDescriptors) {
  Object.defineProperty = function(a, b, c) {
    //IE8支持修改元素节点的属性
    if (origDefineProperty && a.nodeType == 1) {
      return origDefineProperty(a, b, c);
    } else {
      a[b] = c.value || (c.get && c.get());
    }
  };
}

if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      var arguments$1 = arguments;

      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments$1[index];

        if (nextSource !== null && nextSource !== undefined) { 
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
      if (typeof proto !== 'object' && typeof proto !== 'function') {
          throw new TypeError('Object prototype may only be an Object: ' + proto);
      } else if (proto === null || typeof propertiesObject != 'undefined') {
          throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument, nor a second argument.");
      }

      function F() {}
      F.prototype = proto;

      return new F();
  };
}

if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}

if (!Object.values) {
  Object.values = function(obj) {
    var values = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        values.push(obj[i]);
      }
    }

    return values;
  };
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function() {
    var slice = Array.prototype.slice,
        thatFunc = this, 
        thatArg = arguments[0],
        args = slice.call(arguments, 1);
    if (typeof thatFunc !== 'function') {
      throw new TypeError('Function.prototype.bind - ' +
             'what is trying to be bound is not callable');
    }
    return function(){
      var funcArgs = args.concat(slice.call(arguments));
      return thatFunc.apply(thatArg, funcArgs);
    };
  };
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    return function from(arrayLike/*, mapFn, thisArg */) {
      var C = this, items = Object(arrayLike);
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined, T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        if (arguments.length > 2) {
          T = arguments[2];
        }
      }
      var len = toLength(items.length);
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    }
  }());
}

if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this), len = O.length >>> 0;

    if (typeof callbackfn !== 'function' && Object.prototype.toString.call(callbackfn) !== '[object Function]') {
      throw new TypeError();
    }

    if (arguments.length > 1) {
      T = thisArg;
    }

    k = 0;

    while (k < len) {

      var kValue;

      if (k in O) {
        var testResult;
        kValue = O[k];

        if(T) { testResult = callbackfn.call(T, kValue, k, O); } 
        else { testResult = callbackfn(kValue,k,O); }

        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this), len = o.length >>> 0;

      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      var thisArg = arguments[1], k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        k++;
      }

      return undefined;
    },
    configurable: true,
    writable: true
  });
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach (callback, thisArg) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    thisArg = thisArg || this;
    for (var i = 0, l = this.length; i !== l; ++i) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// https://github.com/jonathantneal/array-flat-polyfill/blob/master/src/polyfill-flat.js

if (!Array.prototype.flat) {
	Object.defineProperty(Array.prototype, 'flat', {
		configurable: true,
		value: function flat () {
			var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

			return depth ? Array.prototype.reduce.call(this, function (acc, cur) {
				if (Array.isArray(cur)) {
					acc.push.apply(acc, flat.call(cur, depth - 1));
				} else {
					acc.push(cur);
				}

				return acc;
			}, []) : Array.prototype.slice.call(this);
		},
		writable: true
	});
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// Array.prototype.indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function indexOf(searchElement) {
    if (this === undefined || this === null) {
      throw new TypeError(this + 'is not an object');
    }
  
    var	arraylike = this instanceof String ? this.split('') : this,
      length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
      index = Number(arguments[1]) || 0;
  
    index = (index < 0 ? Math.max(length + index, 0) : index) - 1;
  
    while (++index < length) {
      if (index in arraylike && arraylike[index] === searchElement) {
        return index;
      }
    }
  
    return -1;
  };
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    
    var O = Object(this), len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length > 1) {
      T = arguments[1];
    }

    A = new Array(len);
    k = 0;

    while (k < len) {

      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }

    return A;
  };
}

if (!Array.prototype.some) {
  Array.prototype.some = function(fun, thisArg) {

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

if (!Array.prototype.indexOf || !String.prototype.indexOf) {
  Array.prototype.indexOf = String.prototype.indexOf = function indexOf(searchElement) {

    if (this === undefined || this === null) {
      throw new TypeError(this + 'is undefined or null');
    }

    var	arraylike = this instanceof String ? this.split('') : this,
      length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
      index = Number(arguments[1]) || 0;

    index = (index < 0 ? Math.max(length + index, 0) : index) - 1;

    while (++index < length) {
      if (index in arraylike && arraylike[index] === searchElement) {
        return index;
      }
    }

    return -1;
  };
}

if (!window.addEventListener||!Window.prototype.addEventListener) {
  window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
    var	element = this,
      type = arguments[0],
      listener = arguments[1];

    if (!element._events) {	element._events = {}; }

    if (!element._events[type]) {
      element._events[type] = function (event) {
        var	list = element._events[event.type].list,
          events = list.slice(),
          index = -1,
          length = events.length,
          eventElement;

        event.preventDefault = function preventDefault() {
          if (event.cancelable !== false) {
            event.returnValue = false;
          }
        };

        event.stopPropagation = function stopPropagation() {
          event.cancelBubble = true;
        };

        event.stopImmediatePropagation = function stopImmediatePropagation() {
          event.cancelBubble = true;
          event.cancelImmediate = true;
        };

        event.currentTarget = element;
        event.relatedTarget = event.fromElement || null;
        event.target = event.target || event.srcElement || element;
        event.timeStamp = new Date().getTime();

        if (event.clientX) {
          event.pageX = event.clientX + document.documentElement.scrollLeft;
          event.pageY = event.clientY + document.documentElement.scrollTop;
        }

        while (++index < length && !event.cancelImmediate) {
          if (index in events) {
            eventElement = events[index];

            if (list.indexOf(eventElement) !== -1 && typeof eventElement === 'function') {
              eventElement.call(element, event);
            }
          }
        }
      };

      element._events[type].list = [];

      if (element.attachEvent) {
        element.attachEvent('on' + type, element._events[type]);
      }
    }

    element._events[type].list.push(listener);
  };

  window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
    var	element = this,
      type = arguments[0],
      listener = arguments[1],
      index;

    if (element._events && element._events[type] && element._events[type].list) {
      index = element._events[type].list.indexOf(listener);

      if (index !== -1) {
        element._events[type].list.splice(index, 1);

        if (!element._events[type].list.length) {
          if (element.detachEvent) {
            element.detachEvent('on' + type, element._events[type]);
          }
          delete element._events[type];
        }
      }
    }
  };
}

if (!document.getElementsByClassName) {
  document.getElementsByClassName = Element.prototype.getElementsByClassName = function getElementsByClassName(search) {
    return this.querySelectorAll("." + String(search).split(/\s+/).join('.'));
  };
  // Element.prototype.getElementsByClassName = getElementsByClassName
}

if (!window.Event || !Window.prototype.Event) {
  window.Event = Window.prototype.Event = Document.prototype.Event = Element.prototype.Event = function Event(type, eventInitDict) {
    if (!type) { throw new Error('Not enough arguments'); }
    var event, 
      bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false,
      cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
    if ( 'createEvent' in document ) {
      event = document.createEvent('Event');			
      event.initEvent(type, bubbles, cancelable);
    } else {
      event = document.createEventObject();		
      event.type = type;
      event.bubbles = bubbles;
      event.cancelable = cancelable;	
    }
    return event;
  };
}

if ( !window.CustomEvent || !Window.prototype.CustomEvent) {
  window.CustomEvent = Window.prototype.CustomEvent = Document.prototype.CustomEvent = Element.prototype.CustomEvent = function CustomEvent(type, eventInitDict) {
    if (!type) {
      throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
    }
    var event = new Event(type, eventInitDict);
    event.detail = eventInitDict && eventInitDict.detail || null;
    return event;
  };
}

if (!window.dispatchEvent||!Window.prototype.dispatchEvent||!Document.prototype.dispatchEvent||!Element.prototype.dispatchEvent) {
  window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
    if (!arguments.length) {
      throw new Error('Not enough arguments');
    }

    if (!event || typeof event.type !== 'string') {
      throw new Error('DOM Events Exception 0');
    }

    var element = this, type = event.type;

    try {
      if (!event.bubbles) {
        event.cancelBubble = true;

        var cancelBubbleEvent = function (event) {
          event.cancelBubble = true;

          (element || window).detachEvent('on' + type, cancelBubbleEvent);
        };

        this.attachEvent('on' + type, cancelBubbleEvent);
      }

      this.fireEvent('on' + type, event);
    } catch (error) {
      event.target = element;

      do {
        event.currentTarget = element;

        if ('_events' in element && typeof element._events[type] === 'function') {
          element._events[type].call(element, event);
        }

        if (typeof element['on' + type] === 'function') {
          element['on' + type].call(element, event);
        }

        element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
      } while (element && !event.cancelBubble);
    }

    return true;
  };
}

if (!Number.isFinite) {
  Number.isFinite = function(value) {
    return typeof value === 'number'
      && isFinite(value);
  };
}

if (!Number.isInteger) {
  Number.isInteger = function(value) {
    return typeof value === 'number'
      && isFinite(value)
      && Math.floor(value) === value;
  };
}

if (!Number.isNaN) {
  Number.isNaN = function(value) {
    return typeof value === 'number'
      && value !== value;
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    } 
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if(!Date.now){ 
  Date.now = function now() {
    return new Date().getTime();
  };
}

if (!Node.prototype.contains) {
  Node.prototype.contains = function (el) {
    while (el = el.parentNode) {
      if (el === this) { return true; }
    }
    return false;
  };
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

if (!window.getComputedStyle) {
  (function(){
    function getComputedStylePixel(element, property, fontSize) {
      
      // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
      var value = element.document && element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
        size = value[1],
        suffix = value[2],
        rootSize;
  
      fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
      rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;
  
      return suffix == '%' ? size / 100 * rootSize :
        suffix == 'cm' ? size * 0.3937 * 96 :
        suffix == 'em' ? size * fontSize :
        suffix == 'in' ? size * 96 :
        suffix == 'mm' ? size * 0.3937 * 96 / 10 :
        suffix == 'pc' ? size * 12 * 96 / 72 :
        suffix == 'pt' ? size * 96 / 72 :
        size;
    }
  
    function setShortStyleProperty(style, property) {
      var	borderSuffix = property == 'border' ? 'Width' : '',
        t = property + 'Top' + borderSuffix,
        r = property + 'Right' + borderSuffix,
        b = property + 'Bottom' + borderSuffix,
        l = property + 'Left' + borderSuffix;
  
      style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] 
                      : style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] 
                      : style[l] == style[r] ? [ style[t], style[r], style[b] ] 
                      : [ style[t], style[r], style[b], style[l] ]).join(' ');
    }
  
    // <CSSStyleDeclaration>
    function CSSStyleDeclaration(element) {
      var style = this,
      currentStyle = element.currentStyle,
      fontSize = getComputedStylePixel(element, 'fontSize'),
      unCamelCase = function (match) {
        return '-' + match.toLowerCase();
      },
      property;
  
      for (property in currentStyle) {
        Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));
  
        if (property == 'width') {
          style[property] = element.offsetWidth + 'px';
        } else if (property == 'height') {
          style[property] = element.offsetHeight + 'px';
        } else if (property == 'styleFloat') {
          style.float = currentStyle[property];
        } else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
          style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
        } else if (/^outline/.test(property)) {
          // errors on checking outline
          try {
            style[property] = currentStyle[property];
          } catch (error) {
            style.outlineColor = currentStyle.color;
            style.outlineStyle = style.outlineStyle || 'none';
            style.outlineWidth = style.outlineWidth || '0px';
            style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
          }
        } else {
          style[property] = currentStyle[property];
        }
      }
  
      setShortStyleProperty(style, 'margin');
      setShortStyleProperty(style, 'padding');
      setShortStyleProperty(style, 'border');
  
      style.fontSize = Math.round(fontSize) + 'px';		
    }
    
    CSSStyleDeclaration.prototype = {
      constructor: CSSStyleDeclaration,
      // <CSSStyleDeclaration>.getPropertyPriority
      getPropertyPriority: function () {
        throw new Error('NotSupportedError: DOM Exception 9');
      },
      // <CSSStyleDeclaration>.getPropertyValue
      getPropertyValue: function (property) {
        return this[property.replace(/-\w/g, function (match) {
          return match[1].toUpperCase();
        })];
      },
      // <CSSStyleDeclaration>.item
      item: function (index) {
        return this[index];
      },
      // <CSSStyleDeclaration>.removeProperty
      removeProperty: function () {
        throw new Error('NoModificationAllowedError: DOM Exception 7');
      },
      // <CSSStyleDeclaration>.setProperty
      setProperty: function () {
        throw new Error('NoModificationAllowedError: DOM Exception 7');
      },
      // <CSSStyleDeclaration>.getPropertyCSSValue
      getPropertyCSSValue: function () {
        throw new Error('NotSupportedError: DOM Exception 9');
      }
    };		
  
    // <Global>.getComputedStyle
    window.getComputedStyle = function getComputedStyle(element) {
      return new CSSStyleDeclaration(element);
    };
  })();
}

if ( !self.performance ) {
  self.performance = {};
}
	
if ( !self.performance.now ){	
  var nowOffset = Date.now();
  self.performance.now = function now(){
    return Date.now() - nowOffset;
  };
}

if (!window.requestAnimationFrame) {

  var	lastTime = Date.now();
  window.requestAnimationFrame = function (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + 'is not a function');
    }
    
    var	currentTime = Date.now(),
      delay = 16 + lastTime - currentTime;

    if (delay < 0) { delay = 0;	}

    lastTime = currentTime;

    return setTimeout(function () {
      lastTime = Date.now();

      callback(performance.now());
    }, delay);
  };

  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}
