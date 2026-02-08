/**
 * Admin Configuration Helper
 * Handles application configuration data passed from the backend via window.HashtagCms.adminConfig
 * (with fallback to deprecated window.Laravel.adminConfig for backward compatibility)
 * 
 * @class AdminConfig
 * @example
 * import { AdminConfig } from '@hashtagcms/admin-sdk';
 * 
 * const config = new AdminConfig();
 * const basePath = config.get('base_path', '/admin');
 * const fullUrl = config.admin_path('users/list');
 */
export class AdminConfig {
  /**
   * Create a new AdminConfig instance.
   * Automatically loads config from window.HashtagCms.adminConfig if available,
   * with fallback to window.Laravel.adminConfig for backward compatibility.
   */
  constructor() {
    this.appConfig = (typeof window !== 'undefined' && window.HashtagCms?.adminConfig) 
      ?? (typeof window !== 'undefined' && window.Laravel?.adminConfig) 
      ?? {};
  }

  /**
   * Get a configuration value by key.
   * Uses nullish coalescing to properly handle falsy values like 0, false, ''
   * 
   * @param {string} key - The configuration key to retrieve
   * @param {*} [defaultVal=undefined] - Default value if key doesn't exist
   * @returns {*} The configuration value or default
   * @example
   * config.get('base_path', '/admin')  // Returns base_path or '/admin'
   * config.get('debug', false)         // Returns debug setting or false
   */
  get(key, defaultVal) {
    return this.appConfig[key] ?? defaultVal;
  }

  /**
   * Check if a configuration key exists and has a value.
   * 
   * @param {string} key - The configuration key to check
   * @returns {boolean} True if the key exists and is not null/undefined
   */
  has(key) {
    return this.appConfig[key] != null;
  }

  /**
   * Get all configuration values.
   * 
   * @returns {Object} The entire configuration object
   */
  all() {
    return { ...this.appConfig };
  }

  /**
   * Build a full admin path URL with optional query parameters.
   * 
   * @param {string} path - The path segment (e.g., 'users/list')
   * @param {Object|null} [params=null] - Optional query parameters
   * @returns {string} The full admin URL path
   * @example
   * config.admin_path('users/list')              // '/admin/users/list'
   * config.admin_path('users', { page: 1 })      // '/admin/users?page=1'
   */
  admin_path(path, params = null) {
    let qParamStr = "";
    if (params !== null && Object.prototype.toString.call(params) === "[object Object]") {
      const qParam = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
      qParamStr = "?" + qParam.join("&");
    }
    return this.get("base_path", "") + "/" + path + qParamStr;
  }

  /**
   * Build a full URL to an admin asset.
   * 
   * @param {string} path - The asset path (e.g., 'css/app.css')
   * @returns {string} The full asset URL
   * @example
   * config.admin_asset('css/app.css')  // 'https://example.com/assets/admin/css/app.css'
   */
  admin_asset(path) {
    return this.get("app_url", "") + "/" + this.get("theme_assets", "") + "/" + path;
  }

  /**
   * Build a full URL to a media file.
   * 
   * @param {string} path - The media path
   * @returns {string} The full media URL
   */
  get_media(path) {
    return this.get("media_path", "") + "/" + path;
  }
}

// Singleton instance for convenience
const adminConfig = new AdminConfig();
export default adminConfig;
