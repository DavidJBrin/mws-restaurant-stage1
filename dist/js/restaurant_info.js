!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1));var u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return r(e,null,[{key:"openDatabase",value:function(){if(!navigator.serviceWorker)return Promise.resolve();this.DBPromised=o.default.open("mws-restaurants",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"})})}},{key:"fetchRestaurants",value:function(t){fetch(e.DATABASE_URL).then(function(n){if(!n.ok)throw Error(n.statusText);return n.json().then(function(n){e.DBPromised.then(function(e){if(e){var t=e.transaction("restaurants","readwrite").objectStore("restaurants");n.forEach(function(e){t.put(e)})}}),t(null,n)})}).catch(function(n){e.DBPromised.then(function(e){e.transaction("restaurants").objectStore("restaurants").getAll().then(function(e){e||t(n.message,null),t(null,e)})}),t("An error occurred: "+n.message,null)})}},{key:"fetchRestaurantById",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.find(function(e){return e.id==t});o?n(null,o):n("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.cuisine_type==t});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.neighborhood==t});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(t,n,r){e.fetchRestaurants(function(e,o){if(e)r(e,null);else{var u=o;"all"!=t&&(u=u.filter(function(e){return e.cuisine_type==t})),"all"!=n&&(u=u.filter(function(e){return e.neighborhood==n})),r(null,u)}})}},{key:"fetchNeighborhoods",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),o=r.filter(function(e,t){return r.indexOf(e)==t});t(null,o)}})}},{key:"fetchCuisines",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),o=r.filter(function(e,t){return r.indexOf(e)==t});t(null,o)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return e.photograph?"/img/"+e.photograph:"/img/default"}},{key:"imageExtForURL",value:function(e){return"/img/default"===e?"png":"jpg"}},{key:"mapMarkerForRestaurant",value:function(t,n){return new google.maps.Marker({position:t.latlng,title:t.name,url:e.urlForRestaurant(t),map:n,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants/"}}]),e}();t.default=u},function(e,t,n){"use strict";!function(){function t(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(e,n,r){var o,u=new Promise(function(u,i){t(o=e[n].apply(e,r)).then(u,i)});return u.request=o,u}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function u(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function i(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return function(e,t,r){var o=n(e,t,r);return o.then(function(e){if(e)return new c(e,o.request)})}(this[t],o,arguments)})})}function a(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function f(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function d(e){this._db=e}r(a,"_index",["name","keyPath","multiEntry","unique"]),o(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(c.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),s.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},r(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),u(s,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},r(l,"_tx",["objectStoreNames","mode"]),u(l,"_tx",IDBTransaction,["abort"]),f.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),u(f,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),u(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,a].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=function(e){return Array.prototype.slice.call(e)}(arguments),n=t[t.length-1],r=this._store||this._index,o=r[e].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[a,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var p={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),u=o.request;return u&&(u.onupgradeneeded=function(e){r&&r(new f(u.result,e.oldVersion,u.transaction))}),o.then(function(e){return new d(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};e.exports=p,e.exports.default=e.exports}()},function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e:{default:e}}(n(0));r.default.openDatabase(),window.initMap=function(){o(function(e,t){e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),s(),r.default.mapMarkerForRestaurant(self.restaurant,self.map))})};var o=function(e){if(self.restaurant)e(null,self.restaurant);else{var t=l("id");t?r.default.fetchRestaurantById(t,function(t,n){self.restaurant=n,n?(u(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}},u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=r.default.imageUrlForRestaurant(e),n=r.default.imageExtForURL(t);document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;var o=document.getElementById("restaurant-img");o.className="restaurant-img",o.srcset=t+"-small."+n+" 1x, "+t+"-large."+n+" 2x",o.alt="An image of "+e.name,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&i(),a()},i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);var u=document.createElement("td");u.innerHTML=e[n],r.appendChild(u),t.appendChild(r)}},a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h2");if(n.innerHTML="Reviews",t.appendChild(n),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var o=document.getElementById("reviews-list");e.forEach(function(e){o.appendChild(c(e))}),t.appendChild(o)},c=function(e){var t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);var r=document.createElement("p");r.innerHTML=e.date,t.appendChild(r);var o=document.createElement("p");o.innerHTML="Rating: "+e.rating,t.appendChild(o);var u=document.createElement("p");return u.innerHTML=e.comments,t.appendChild(u),t},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,n.setAttribute("aria-current","page"),t.appendChild(n)},l=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}}]);