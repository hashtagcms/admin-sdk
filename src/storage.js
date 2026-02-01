/**
 * Simple In-Memory Storage Wrapper
 * Intended to be compatible with secure-ls or other storage mechanisms
 */
export class Storage {
  constructor() {
    this.obj = {};
    this.counter = 1;
  }

  nextCounter() {
    return this.counter++;
  }

  store(name, value) {
    this.obj[name] = value;
  }

  fetch(name) {
    return this.obj[name];
  }

  clear(name) {
    return delete this.obj[name];
  }
}
