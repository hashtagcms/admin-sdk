import axios from "axios";

/**
 * Fetcher Wrapper
 */
export class Fetcher {
  get(url, config) {
    return axios.get(url, config);
  }
  
  post(url, data, config) {
    return axios.post(url, data, config);
  }

  put(url, data, config) {
      return axios.put(url, data, config);
  }

  delete(url, config) {
      return axios.delete(url, config);
  }
}
