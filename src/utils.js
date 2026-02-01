const CLIPBOARD_KEY = "htcms_cps";

/**
 * queryBuilder
 * Get Param from query
 */
export class queryBuilder {
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
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else if (typeof window !== 'undefined') {
    window.localStorage.setItem(CLIPBOARD_KEY, text);
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

/**
 * Paste from clipboard
 */
export async function PasteFromClipboard() {
  try {
    if (typeof navigator === 'undefined') throw new Error("Navigator not available");
    
    const permission = await navigator.permissions.query({
      name: "clipboard-read",
    });
    if (permission.state === "denied") {
      throw new Error("Not allowed to read clipboard.");
    }
    return navigator.clipboard.read();
  } catch (error) {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.localStorage.getItem(CLIPBOARD_KEY)) {
        let data = window.localStorage.getItem(CLIPBOARD_KEY);
        resolve(data);
      } else {
        reject(null);
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
