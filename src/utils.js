const CLIPBOARD_KEY = "htcms_cps";

/**
 * Safely parse a prop value that may be a JSON string, undefined, null, or empty.
 * This utility reduces boilerplate in Vue component data() functions.
 * 
 * @param {*} prop - The prop value to parse (can be string, object, undefined, null, '')
 * @param {*} [defaultValue=null] - Default value if prop is undefined, null, empty, or parsing fails
 * @returns {*} Parsed value or default value
 * @example
 * // In Vue component data()
 * data() {
 *   return {
 *     sites: SafeJsonParse(this.dataSites, []),
 *     config: SafeJsonParse(this.dataConfig, {})
 *   }
 * }
 */
export function SafeJsonParse(prop, defaultValue = null) {
    if (prop === undefined || prop === null || prop === '' || prop.toString() === 'null') {
        return defaultValue;
    }
    if (typeof prop === 'object') {
        return prop;
    }
    try {
        return typeof prop === 'string' ? JSON.parse(prop) : prop;
    } catch (e) {
        console.warn('HashtagCms: Failed to parse prop:', e.message);
        return defaultValue;
    }
}

/**
 * Safely extract error data from an Axios error response.
 * Handles cases where error.response is undefined (network errors, timeouts, CORS).
 * 
 * @param {Error} error - The error object from Axios catch block
 * @param {Object} [defaults={}] - Additional default properties to include
 * @returns {Object} Error data object with at least a 'message' property
 * @example
 * axios.get(url)
 *   .then(res => ...)
 *   .catch(error => {
 *     const errorData = SafeErrorData(error);
 *     console.log(errorData.message);
 *   });
 */
export function SafeErrorData(error, defaults = {}) {
    if (error.response?.data) {
        return { ...defaults, ...error.response.data };
    }
    return {
        message: error.message || 'An unexpected error occurred',
        ...defaults
    };
}

/**
 * QueryBuilder
 * Get Param from query
 */
export class QueryBuilder {
  static get cache() {
    return {};
  }

  static get(param, custom) {
    if (this.cache[param]) {
      return this.cache[param];
    }
    let query =
      typeof custom == "undefined"
        ? (typeof window !== 'undefined' ? window.location.search.substring(1) : '')
        : custom;
    let query_arr = query.split("&");
    let all = {};
    for (let i = 0; i < query_arr.length; i++) {
      let current = query_arr[i].split("=");
      let key = current[0];
      let value = current[1];
      if (current.length > 2) {
        current.shift();
        value = current.join("=");
      }
      all[key] = value;

      if (key === param) {
        let val = decodeURIComponent(value);
        this.cache[param] = val;
        return val;
      }
    }
    return param == null ? all : "";
  }
  static all(custom) {
    return this.get(null, custom);
  }
}

/**
 * Form Serialization Helper
 */
export class Utils {
  serializeFormArray(form) {
    if (typeof document === 'undefined') return [];
    
    form = typeof form == "string" ? document.getElementById(form) : form;
    let field,
      l,
      s = [];
    if (typeof form == "object" && form && form.nodeName === "FORM") {
      let len = form.elements.length;
      for (let i = 0; i < len; i++) {
        field = form.elements[i];
        if (
          field.name &&
          !field.disabled &&
          field.type !== "file" &&
          field.type !== "reset" &&
          field.type !== "submit" &&
          field.type !== "button"
        ) {
          if (field.type === "select-multiple") {
            l = form.elements[i].options.length;
            for (let j = 0; j < l; j++) {
              if (field.options[j].selected)
                s[s.length] = {
                  name: field.name,
                  value: field.options[j].value,
                };
            }
          } else if (
            (field.type !== "checkbox" && field.type !== "radio") ||
            field.checked
          ) {
            s[s.length] = { name: field.name, value: field.value };
          }
        }
      }
    }
    return s;
  }
}

/**
 * Copy to clipboard
 */
export function CopyToClipboard(text) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } 
    
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CLIPBOARD_KEY, text);
      
      // Fallback for browsers that don't support navigator.clipboard but support execCommand
      if (!navigator.clipboard) {
          const el = document.createElement("textarea");
          el.value = text;
          el.style.position = "absolute";
          el.style.left = "-99999px";
          el.style.top = "-99999px";
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
      }
    }
    return true;
  } catch (e) {
    console.error("HashtagCms: Copy failed", e);
    return false;
  }
}

/**
 * Paste from clipboard
 */
export async function PasteFromClipboard() {
  try {
    if (typeof navigator === "undefined")
      throw new Error("Navigator not available");

    // Some browsers (like Safari/Firefox) may not support permission query for clipboard-read
    // or may require a secure context (HTTPS/localhost)
    if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        try {
            // Attempt to read directly - browser will manage permissions/prompts
            return await navigator.clipboard.readText();
        } catch (e) {
            console.warn("HashtagCms: Native clipboard read failed, trying permission query...", e.message);
        }
    }

    // Permission API fallback check
    if (navigator.permissions && typeof navigator.permissions.query === "function") {
        try {
            const permission = await navigator.permissions.query({ name: "clipboard-read" });
            if (permission.state === "denied") {
                throw new Error("Permission denied");
            }
        } catch (e) {
            // Permission API query might fail (e.g. name not supported), we'll ignore and try fallback
        }
    }

    // Attempt native read again if possible, or move to storage fallback
    if (navigator.clipboard) {
        return await navigator.clipboard.readText();
    }
    
    throw new Error("Native Clipboard API unavailable");

  } catch (error) {
    // Final fallback to localStorage if defined
    return new Promise((resolve, reject) => {
      const data = typeof window !== "undefined" ? window.localStorage.getItem(CLIPBOARD_KEY) : null;
      if (data) {
        resolve(data);
      } else {
        reject(new Error("No data found in clipboard or storage"));
      }
    });
  }
}

/**
 * Check if string is a json
 */
export function IsJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Humanize string
 */
export function Humanize(value) {
  if (!value) return "";
  value = value.toString().replace(/_/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Clean string for URL
 */
export function CleanForUrl(str, replaceWith = "-") {
  return str.replace(/\s|'/g, replaceWith);
}

/**
 * Title Case string
 */
export function TitleCase(value) {
  value = value.replace(/\.|_/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}
