/**
 * MapQuest API Helper
 * https://developer.mapquest.com
 * 
 * @class MapAPI
 * @example
 * import { MapAPI } from '@hashtagcms/admin-sdk';
 * 
 * const map = new MapAPI('your-api-key');
 * map.init();
 * const location = await map.getLatLong('New York, NY');
 */

import { AdminConfig } from './admin-config';

// Default MapQuest resources (can be overridden via config)
const DEFAULT_MAPQUEST_URL = "http://www.mapquestapi.com/geocoding/v2/";
const DEFAULT_MAPQUEST_JS = "https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.js";
const DEFAULT_MAPQUEST_CSS = "https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.css";

export default class MapAPI {
  /**
   * Create a MapAPI instance.
   * 
   * @param {string|null} [apiKey=null] - MapQuest API key. If not provided, will try to get from AdminConfig.
   * @param {Object} [options={}] - Additional configuration options
   * @param {string} [options.apiUrl] - Custom API URL
   * @param {string} [options.jsUrl] - Custom JS SDK URL
   * @param {string} [options.cssUrl] - Custom CSS URL
   */
  constructor(apiKey = null, options = {}) {
    const adminConfig = new AdminConfig();
    
    this.apiKey = apiKey || adminConfig.get('mapquest_api_key');
    this.apiUrl = options.apiUrl || adminConfig.get('mapquest_api_url') || DEFAULT_MAPQUEST_URL;
    this.jsUrl = options.jsUrl || adminConfig.get('mapquest_js_url') || DEFAULT_MAPQUEST_JS;
    this.cssUrl = options.cssUrl || adminConfig.get('mapquest_css_url') || DEFAULT_MAPQUEST_CSS;
    
    this.callback = [];
    this.isInit = false;
    
    if (!this.apiKey) {
      console.warn('HashtagCms MapAPI: No API key provided. Set mapquest_api_key in adminConfig or pass to constructor.');
    }
  }

  /**
   * Initialize the MapQuest SDK by loading JS and CSS resources.
   * Should be called before using map features.
   * 
   * @returns {boolean} True if initialization started, false if already initialized or not in browser
   */
  init() {
    if (typeof document === 'undefined') {
      console.warn('HashtagCms MapAPI: Cannot initialize outside browser environment.');
      return false;
    }
    
    if (this.isInit) {
      return false;
    }

    const head = document.head || document.getElementsByTagName('head')[0];
    
    // Load JS SDK
    const script = document.createElement("script");
    script.src = this.jsUrl;
    script.async = true;
    head.appendChild(script);

    // Load CSS
    const css = document.createElement("link");
    css.setAttribute("type", "text/css");
    css.setAttribute("rel", "stylesheet");
    css.href = this.cssUrl;
    head.appendChild(css);

    this.isInit = true;
    return true;
  }

  /**
   * Geocode an address to get latitude/longitude coordinates.
   * 
   * @param {string} address - The address to geocode
   * @param {Function|null} [callback=null] - Optional callback function (deprecated, use Promise)
   * @returns {Promise<Object>} Promise resolving to the geocoding response
   * @throws {Error} If API key is not configured
   * @example
   * const result = await map.getLatLong('1600 Pennsylvania Ave, Washington DC');
   * console.log(result.data.results[0].locations[0].latLng);
   */
  getLatLong(address, callback = null) {
    if (!this.apiKey) {
      return Promise.reject(new Error('MapQuest API key is not configured'));
    }

    const url = `${this.apiUrl}address?key=${encodeURIComponent(this.apiKey)}&location=${encodeURIComponent(address)}`;

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          resolve(res);
          if (callback != null && typeof callback === "function") {
            callback.call(this, res);
          }
        })
        .catch((e) => {
          reject(e);
          if (callback != null && typeof callback === "function") {
            callback.call(this, e);
          }
        });
    });
  }

  /**
   * Parse geocoding results into a simplified format.
   * 
   * @param {Object} response - The response from getLatLong
   * @returns {Array<Object>} Array of parsed location objects
   */
  parseResults(response) {
    const data = [];
    const results = response?.data?.results?.[0];
    
    if (!results) {
      return data;
    }

    const allLocations = results.locations || [];
    
    allLocations.forEach((location) => {
      data.push({
        country: location.adminArea1,
        state: location.adminArea3,
        city: location.adminArea5,
        latLng: location.latLng,
        displayLatLng: location.displayLatLng,
        postalCode: location.postalCode,
        street: location.street,
        sideOfStreet: location.sideOfStreet
      });
    });

    return data;
  }
}
