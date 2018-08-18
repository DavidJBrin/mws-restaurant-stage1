/**
 * Common database helper functions.
 */

import idb from  'idb';
import { RSA_X931_PADDING } from 'constants';

export default class DBHelper {
  static openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
    
    // Create the database and makesure the object store is unique on id so we don't add duplicates.
    this.DBPromised = idb.open('mws-restaurants', 2, function(upgradeDb) {
      switch(upgradeDb.oldVersion) {
        case 0:
          upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
          });
        case 1:
          // Create store and index for reviews.
          const reviewStore = upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
          reviewStore.createIndex('restaurantID', ['restaurant_id', 'createdAt']);
          // Create store for deffered reviews.
          const deferredStore = upgradeDb.createObjectStore('deferredReviews', { keyPath: 'deferredAt' });
          deferredStore.createIndex('restaurantID', ['restaurant_id', 'deferredAt']);
        }
    });
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    // return `http://httpstat.us/502`;
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
    // xhr.onload = () => {
    //   if (xhr.status === 200) { // Got a success response from server!
    //     const json = JSON.parse(xhr.responseText);
    //     callback(null, json);
    //   } else { // Oops!. Got an error from server.
    //     const error = (`Request failed. Returned status of ${xhr.status}`);
    //     callback(error, null);
    //   }
    // };
    // xhr.send();

    fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json().then((json) => {
          DBHelper.DBPromised.then((db) => {
            if (!db) return;

            const tx = db.transaction('restaurants','readwrite');
            const store = tx.objectStore('restaurants');
            json.forEach((restaurant) => {
              store.put(restaurant);
            });
          });

          callback(null, json);
        });
      })
      .catch(e => {
        DBHelper.DBPromised.then(db => {
          const store = db.transaction('restaurants').objectStore('restaurants');

          store.getAll()
            .then(restaurants => {
              if (!restaurants) callback(`Couldn't find restaurants in IDB: ${e.message}`, null);
              callback(null, restaurants);
            });
        });
      });
  }

  static getRestaurantReviews(id, callback) {
    return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(json => {
        DBHelper.DBPromised.then((db) => {
          if (!db) return;

          const tx = db.transaction('reviews','readwrite');
          const store = tx.objectStore('reviews');
          json.forEach((review) => {
            store.put(review);
          });
        });
        callback(null, json);
      })
      .catch(e => {
        // Error fetching, try geting reviews from IDB.
        DBHelper.DBPromised.then(db => {
          const tx = db.transaction(['reviews', 'deferredReviews'])
          const revStore = tx.objectStore('reviews').index('restaurantID');
          const deferredStore = tx.objectStore('deferredReviews').index('restaurantID');
          id = parseInt(id);
          // Create range to include only id, the index is a compound index on id + create date
          const range = IDBKeyRange.bound([id], [id+1], true, false);
          Promise.all([revStore.getAll(range), deferredStore.getAll(range)])
            .then(reviews => {
              reviews = [...reviews[0], ...reviews[1]];
              if (!reviews) return callback(`An error occured: ${e.message}`, null);
              if (reviews.length === 0) return callback(null, null);
              callback(null, reviews);
            });
        });
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  static updateFavorite(id, fav) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}/?is_favorite=${fav}`, {
      method: 'PUT'
    })
    .then(() => {
      DBHelper.DBPromised
        .then((db) => {
          const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
            store.get(id)
              .then((restaurant) => {
                restaurant.is_favorite = fav;
                store.put(restaurant);
              });
        });
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) return (`/img/${restaurant.photograph}`);
    return `/img/${restaurant.id}`;
  }

  static imageExtForURL(URL) {
    if (URL === '/img/default') return 'png';
    return 'jpg';
  }
  /**
   * Map marker for a restaurant.
   */
  // static mapMarkerForRestaurant(restaurant, map) {
  //   const marker = new google.maps.Marker({
  //     position: restaurant.latlng,
  //     title: restaurant.name,
  //     url: DBHelper.urlForRestaurant(restaurant),
  //     map: map,
  //     animation: google.maps.Animation.DROP}
  //   );
  //   return marker;
  // }
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(self.newMap);
    return marker;
  }

  static submitDeferred() {
    DBHelper.DBPromised.then( db => {
      const store =  db.transaction('deferredReviews').objectStore('deferredReviews');
      const submittedRes = {};
      store.getAll()
      .then( revs => {
        if (revs.length === 0) return;
        return Promise.all(revs.map( rev => {
          return fetch(`${DBHelper.DATABASE_URL}/reviews`, {
            method: 'POST',
            body: JSON.stringify({
              restaurant_id: rev.restaurant_id,
              name: rev.name,
              createdAt: rev.deferredAt,
              rating: rev.rating,
              comments: rev.comments
            })
          })
          .then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then(json => {
            if (rev.restaurant_name in submittedRes) {
              submittedRes[rev.restaurant_name] = submittedRes[rev.restaurant_name] + 1;
            } else {
              submittedRes[rev.restaurant_name] = 1;
            }
            return json;
          });
        }));
      })
      .then((serverRevs) => {
          if (!serverRevs) return;
          if (Object.keys(submittedRes).length === 0) return;
          DBHelper.showDeferredSubmitModal(submittedRes);
          const store =  db.transaction('deferredReviews', 'readwrite').objectStore('deferredReviews');
          store.clear();
        });
    });
  }

  static showDeferredSubmitModal(reviews) {
    const modal = document.createElement('div');
    modal.classList.add('deferredModal');
    let restaurantHTML = '';
    for (const restaurant in reviews) {
      restaurantHTML += `<p>Submitted ${reviews[restaurant]} review(s) for ${restaurant}</p>`
    }
    restaurantHTML += `<p>Please refresh the app to see your live reviews</p>`;
    modal.innerHTML = restaurantHTML;
    document.body.insertBefore(modal, document.body.firstChild);
    window.setTimeout(() => {
      document.body.removeChild(modal);
    }, 3000);
  }
}