!function(t){function e(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")}var n,i,o;function r(t,e){(n(t,e)?o:i)(t,e)}"classList"in document.documentElement?(n=function(t,e){return t.classList.contains(e)},i=function(t,e){t.classList.add(e)},o=function(t,e){t.classList.remove(e)}):(n=function(t,n){return e(n).test(t.className)},i=function(t,e){n(t,e)||(t.className=t.className+" "+e)},o=function(t,n){t.className=t.className.replace(e(n)," ")});var s={hasClass:n,addClass:i,removeClass:o,toggleClass:r,has:n,add:i,remove:o,toggle:r};"function"==typeof define&&define.amd?define("classie/classie",s):t.classie=s}(window),function(){function t(){}var e=t.prototype,n=this,i=n.EventEmitter;function o(t,e){for(var n=t.length;n--;)if(t[n].listener===e)return n;return-1}function r(t){return function(){return this[t].apply(this,arguments)}}e.getListeners=function(t){var e,n,i=this._getEvents();if(t instanceof RegExp){e={};for(n in i)i.hasOwnProperty(n)&&t.test(n)&&(e[n]=i[n])}else e=i[t]||(i[t]=[]);return e},e.flattenListeners=function(t){var e,n=[];for(e=0;e<t.length;e+=1)n.push(t[e].listener);return n},e.getListenersAsObject=function(t){var e,n=this.getListeners(t);return n instanceof Array&&((e={})[t]=n),e||n},e.addListener=function(t,e){var n,i=this.getListenersAsObject(t),r="object"==typeof e;for(n in i)i.hasOwnProperty(n)&&-1===o(i[n],e)&&i[n].push(r?e:{listener:e,once:!1});return this},e.on=r("addListener"),e.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},e.once=r("addOnceListener"),e.defineEvent=function(t){return this.getListeners(t),this},e.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},e.removeListener=function(t,e){var n,i,r=this.getListenersAsObject(t);for(i in r)r.hasOwnProperty(i)&&-1!==(n=o(r[i],e))&&r[i].splice(n,1);return this},e.off=r("removeListener"),e.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},e.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},e.manipulateListeners=function(t,e,n){var i,o,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(i=n.length;i--;)r.call(this,e,n[i]);else for(i in e)e.hasOwnProperty(i)&&(o=e[i])&&("function"==typeof o?r.call(this,i,o):s.call(this,i,o));return this},e.removeEvent=function(t){var e,n=typeof t,i=this._getEvents();if("string"===n)delete i[t];else if(t instanceof RegExp)for(e in i)i.hasOwnProperty(e)&&t.test(e)&&delete i[e];else delete this._events;return this},e.removeAllListeners=r("removeEvent"),e.emitEvent=function(t,e){var n,i,o,r=this.getListenersAsObject(t);for(o in r)if(r.hasOwnProperty(o))for(i=r[o].length;i--;)!0===(n=r[o][i]).once&&this.removeListener(t,n.listener),n.listener.apply(this,e||[])===this._getOnceReturnValue()&&this.removeListener(t,n.listener);return this},e.trigger=r("emitEvent"),e.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},e.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},e._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},e._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return n.EventEmitter=i,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:this.EventEmitter=t}.call(this),function(t){var e=document.documentElement,n=function(){};function i(e){var n=t.event;return n.target=n.target||n.srcElement||e,n}e.addEventListener?n=function(t,e,n){t.addEventListener(e,n,!1)}:e.attachEvent&&(n=function(t,e,n){t[e+n]=n.handleEvent?function(){var e=i(t);n.handleEvent.call(n,e)}:function(){var e=i(t);n.call(t,e)},t.attachEvent("on"+e,t[e+n])});var o=function(){};e.removeEventListener?o=function(t,e,n){t.removeEventListener(e,n,!1)}:e.detachEvent&&(o=function(t,e,n){t.detachEvent("on"+e,t[e+n]);try{delete t[e+n]}catch(i){t[e+n]=void 0}});var r={bind:n,unbind:o};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(this),function(t){var e="Webkit Moz ms Ms O".split(" "),n=document.documentElement.style;function i(t){if(t){if("string"==typeof n[t])return t;var i;t=t.charAt(0).toUpperCase()+t.slice(1);for(var o=0,r=e.length;o<r;o++)if(i=e[o]+t,"string"==typeof n[i])return i}}"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return i}):"object"==typeof exports?module.exports=i:t.getStyleProperty=i}(window),function(t,e){var n=t.getComputedStyle,i=n?function(t){return n(t,null)}:function(t){return t.currentStyle};function o(t){var e=parseFloat(t);return-1===t.indexOf("%")&&!isNaN(e)&&e}var r=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];function s(t){var e,s=t("boxSizing");function a(t,e){if(n||-1===e.indexOf("%"))return e;var i=t.style,o=i.left,r=t.runtimeStyle,s=r&&r.left;return s&&(r.left=t.currentStyle.left),i.left=e,e=i.pixelLeft,i.left=o,s&&(r.left=s),e}return function(){if(s){var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style[s]="border-box";var n=document.body||document.documentElement;n.appendChild(t);var r=i(t);e=200===o(r.width),n.removeChild(t)}}(),function(t){if("string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var n=i(t);if("none"===n.display)return function(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,n=r.length;e<n;e++)t[r[e]]=0;return t}();var h={};h.width=t.offsetWidth,h.height=t.offsetHeight;for(var d=h.isBorderBox=!(!s||!n[s]||"border-box"!==n[s]),p=0,u=r.length;p<u;p++){var c=r[p],f=n[c];f=a(t,f);var l=parseFloat(f);h[c]=isNaN(l)?0:l}var g=h.paddingLeft+h.paddingRight,v=h.paddingTop+h.paddingBottom,m=h.marginLeft+h.marginRight,y=h.marginTop+h.marginBottom,E=h.borderLeftWidth+h.borderRightWidth,x=h.borderTopWidth+h.borderBottomWidth,b=d&&e,L=o(n.width);!1!==L&&(h.width=L+(b?0:g+E));var P=o(n.height);return!1!==P&&(h.height=P+(b?0:v+x)),h.innerWidth=h.width-(g+E),h.innerHeight=h.height-(v+x),h.outerWidth=h.width+m,h.outerHeight=h.height+y,h}}}"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],s):"object"==typeof exports?module.exports=s(require("get-style-property")):t.getSize=s(t.getStyleProperty)}(window),function(t){var e=t.document;function n(t,e){for(var n in e)t[n]=e[n];return t}function i(){}for(var o,r=e.defaultView,s=r&&r.getComputedStyle?function(t){return r.getComputedStyle(t,null)}:function(t){return t.currentStyle},a="object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1===t.nodeType&&"string"==typeof t.nodeName},h=0,d="webkit moz ms o".split(" "),p=t.requestAnimationFrame,u=t.cancelAnimationFrame,c=0;c<d.length&&(!p||!u);c++)o=d[c],p=p||t[o+"RequestAnimationFrame"],u=u||t[o+"CancelAnimationFrame"]||t[o+"CancelRequestAnimationFrame"];function f(o,r,h,d,u){var c=d("transform"),f=!!d("perspective");function l(t,i){this.element="string"==typeof t?e.querySelector(t):t,this.options=n({},this.options),n(this.options,i),this._create()}function g(){return!1}n(l.prototype,r.prototype),l.prototype.options={},l.prototype._create=function(){this.position={},this._getPosition(),this.startPoint={x:0,y:0},this.dragPoint={x:0,y:0},this.startPosition=n({},this.position);var t=s(this.element);"relative"!==t.position&&"absolute"!==t.position&&(this.element.style.position="relative"),this.enable(),this.setHandles()},l.prototype.setHandles=function(){this.handles=this.options.handle?this.element.querySelectorAll(this.options.handle):[this.element];for(var e=0,n=this.handles.length;e<n;e++){var i=this.handles[e];t.navigator.pointerEnabled?(h.bind(i,"pointerdown",this),i.style.touchAction="none"):t.navigator.msPointerEnabled?(h.bind(i,"MSPointerDown",this),i.style.msTouchAction="none"):(h.bind(i,"mousedown",this),h.bind(i,"touchstart",this),v(i))}};var v="attachEvent"in e.documentElement?function(t){"IMG"===t.nodeName&&(t.ondragstart=g);for(var e=t.querySelectorAll("img"),n=0,i=e.length;n<i;n++){e[n].ondragstart=g}}:i;function m(t,e){t.x=void 0!==e.pageX?e.pageX:e.clientX,t.y=void 0!==e.pageY?e.pageY:e.clientY}l.prototype._getPosition=function(){var t=s(this.element),e=parseInt(t.left,10),n=parseInt(t.top,10);this.position.x=isNaN(e)?0:e,this.position.y=isNaN(n)?0:n,this._addTransformPosition(t)},l.prototype._addTransformPosition=function(t){if(c){var e=t[c];if(0===e.indexOf("matrix")){var n=e.split(","),i=0===e.indexOf("matrix3d")?12:4,o=parseInt(n[i],10),r=parseInt(n[i+1],10);this.position.x+=o,this.position.y+=r}}},l.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},l.prototype.getTouch=function(t){for(var e=0,n=t.length;e<n;e++){var i=t[e];if(i.identifier===this.pointerIdentifier)return i}},l.prototype.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this.dragStart(t,t)},l.prototype.ontouchstart=function(t){this.isDragging||this.dragStart(t,t.changedTouches[0])},l.prototype.onMSPointerDown=l.prototype.onpointerdown=function(t){this.isDragging||this.dragStart(t,t)};var y={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"],MSPointerDown:["MSPointerMove","MSPointerUp","MSPointerCancel"]};function E(t,e,n){return n=n||"round",e?Math[n](t/e)*e:t}l.prototype.dragStart=function(n,i){this.isEnabled&&(this.pointerIdentifier=void 0!==i.pointerId?i.pointerId:i.identifier,this._getPosition(),this.measureContainment(),m(this.startPoint,i),this.startPosition.x=this.position.x,this.startPosition.y=this.position.y,this.setLeftTop(),this.dragPoint.x=0,this.dragPoint.y=0,this._bindEvents({events:y[n.type],node:n.preventDefault?t:e}),o.add(this.element,"is-dragging"),this.isDragging=!0,this.emitEvent("dragStart",[this,n,i]),this.animate())},l.prototype._bindEvents=function(t){for(var e=0,n=t.events.length;e<n;e++){var i=t.events[e];h.bind(t.node,i,this)}this._boundEvents=t},l.prototype._unbindEvents=function(){var t=this._boundEvents;if(t&&t.events){for(var e=0,n=t.events.length;e<n;e++){var i=t.events[e];h.unbind(t.node,i,this)}delete this._boundEvents}},l.prototype.measureContainment=function(){var t=this.options.containment;if(t){this.size=u(this.element);var n=this.element.getBoundingClientRect(),i=a(t)?t:"string"==typeof t?e.querySelector(t):this.element.parentNode;this.containerSize=u(i);var o=i.getBoundingClientRect();this.relativeStartPosition={x:n.left-o.left,y:n.top-o.top}}},l.prototype.onmousemove=function(t){this.dragMove(t,t)},l.prototype.onMSPointerMove=l.prototype.onpointermove=function(t){t.pointerId===this.pointerIdentifier&&this.dragMove(t,t)},l.prototype.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this.dragMove(t,e)},l.prototype.dragMove=function(t,e){m(this.dragPoint,e);var n=this.dragPoint.x-this.startPoint.x,i=this.dragPoint.y-this.startPoint.y,o=this.options.grid,r=o&&o[0],s=o&&o[1];n=E(n,r),i=E(i,s),n=this.containDrag("x",n,r),i=this.containDrag("y",i,s),n="y"===this.options.axis?0:n,i="x"===this.options.axis?0:i,this.position.x=this.startPosition.x+n,this.position.y=this.startPosition.y+i,this.dragPoint.x=n,this.dragPoint.y=i,this.emitEvent("dragMove",[this,t,e])},l.prototype.containDrag=function(t,e,n){if(!this.options.containment)return e;var i="x"===t?"width":"height",o=this.relativeStartPosition[t],r=E(-o,n,"ceil"),s=this.containerSize[i]-o-this.size[i];return s=E(s,n,"floor"),Math.min(s,Math.max(r,e))},l.prototype.onmouseup=function(t){this.dragEnd(t,t)},l.prototype.onMSPointerUp=l.prototype.onpointerup=function(t){t.pointerId===this.pointerIdentifier&&this.dragEnd(t,t)},l.prototype.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this.dragEnd(t,e)},l.prototype.dragEnd=function(t,e){this.isDragging=!1,delete this.pointerIdentifier,c&&(this.element.style[c]="",this.setLeftTop()),this._unbindEvents(),o.remove(this.element,"is-dragging"),this.emitEvent("dragEnd",[this,t,e])},l.prototype.onMSPointerCancel=l.prototype.onpointercancel=function(t){t.pointerId===this.pointerIdentifier&&this.dragEnd(t,t)},l.prototype.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);this.dragEnd(t,e)},l.prototype.animate=function(){if(this.isDragging){this.positionDrag();var t=this;p(function(){t.animate()})}};var x=f?function(t,e){return"translate3d( "+t+"px, "+e+"px, 0)"}:function(t,e){return"translate( "+t+"px, "+e+"px)"};return l.prototype.setLeftTop=function(){this.element.style.left=this.position.x+"px",this.element.style.top=this.position.y+"px"},l.prototype.positionDrag=c?function(){this.element.style[c]=x(this.dragPoint.x,this.dragPoint.y)}:l.prototype.setLeftTop,l.prototype.enable=function(){this.isEnabled=!0},l.prototype.disable=function(){this.isEnabled=!1,this.isDragging&&this.dragEnd()},l}p&&u||(p=function(e){var n=(new Date).getTime(),i=Math.max(0,16-(n-h)),o=t.setTimeout(function(){e(n+i)},i);return h=n+i,o},u=function(e){t.clearTimeout(e)}),"function"==typeof define&&define.amd?define(["classie/classie","eventEmitter/EventEmitter","eventie/eventie","get-style-property/get-style-property","get-size/get-size"],f):t.Draggabilly=f(t.classie,t.EventEmitter,t.eventie,t.getStyleProperty,t.getSize)}(window);