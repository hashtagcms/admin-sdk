/**
 * Simple Storage Wrapper
 * Provides in-memory and optional localStorage persistence.
 * 
 * @class Storage
 * @example
 * import { Storage, Store } from '@hashtagcms/admin-sdk';
 * 
 * // Use the singleton
 * Store.store('user', { name: 'John' });
 * const user = Store.fetch('user');
 * 
 * // Or create a persistent instance
 * const persistentStore = new Storage({ persistent: true, prefix: 'myapp_' });
 * persistentStore.store('settings', { theme: 'dark' });
 */
export class Storage {
  /**
   * Create a new Storage instance.
   * 
   * @param {Object} [options={}] - Configuration options
   * @param {boolean} [options.persistent=false] - If true, data is also stored in localStorage
   * @param {string} [options.prefix='htcms_'] - Prefix for localStorage keys
   */
  constructor(options = {}) {
    this.obj = {};
    this.counter = 1;
    this.persistent = options.persistent ?? false;
    this.prefix = options.prefix ?? 'htcms_';
  }

  /**
   * Get the next counter value (useful for generating unique IDs).
   * 
   * @returns {number} The next counter value
   */
  nextCounter() {
    return this.counter++;
  }

  /**
   * Store a value by name.
   * If persistent mode is enabled, also saves to localStorage.
   * 
   * @param {string} name - The key to store under
   * @param {*} value - The value to store (will be JSON serialized for localStorage)
   * @returns {*} The stored value
   */
  store(name, value) {
    this.obj[name] = value;
    
    if (this.persistent && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.prefix + name, JSON.stringify(value));
      } catch (e) {
        console.warn('HashtagCms Storage: Failed to persist to localStorage:', e.message);
      }
    }
    
    return value;
  }

  /**
   * Fetch a value by name.
   * If not found in memory and persistent mode is enabled, checks localStorage.
   * 
   * @param {string} name - The key to fetch
   * @param {*} [defaultValue=undefined] - Default value if not found
   * @returns {*} The stored value or default
   */
  fetch(name, defaultValue) {
    // Check in-memory first
    if (this.obj[name] !== undefined) {
      return this.obj[name];
    }
    
    // Check localStorage if persistent
    if (this.persistent && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.prefix + name);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          this.obj[name] = parsed; // Cache in memory
          return parsed;
        }
      } catch (e) {
        console.warn('HashtagCms Storage: Failed to read from localStorage:', e.message);
      }
    }
    
    return defaultValue;
  }

  /**
   * Check if a key exists in storage.
   * 
   * @param {string} name - The key to check
   * @returns {boolean} True if the key exists
   */
  has(name) {
    if (this.obj[name] !== undefined) {
      return true;
    }
    
    if (this.persistent && typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.prefix + name) !== null;
    }
    
    return false;
  }

  /**
   * Clear a value by name, or clear all values if no name provided.
   * 
   * @param {string|null} [name=null] - The key to clear, or null to clear all
   * @returns {boolean} True if successful
   */
  clear(name = null) {
    if (name === null) {
      // Clear all
      this.obj = {};
      this.counter = 1;
      
      if (this.persistent && typeof localStorage !== 'undefined') {
        // Only clear items with our prefix
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      return true;
    }
    
    // Clear specific key
    delete this.obj[name];
    
    if (this.persistent && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.prefix + name);
    }
    
    return true;
  }

  /**
   * Get all stored keys.
   * 
   * @returns {string[]} Array of stored keys (without prefix)
   */
  keys() {
    const memoryKeys = Object.keys(this.obj);
    
    if (this.persistent && typeof localStorage !== 'undefined') {
      const localKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          localKeys.push(key.substring(this.prefix.length));
        }
      }
      // Merge and dedupe
      return [...new Set([...memoryKeys, ...localKeys])];
    }
    
    return memoryKeys;
  }
}

// Default singleton instance (in-memory only for backward compatibility)
export const Store = new Storage();
