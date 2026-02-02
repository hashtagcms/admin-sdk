/**
 * Left Menu Helper
 */
export class LeftMenu {
  /**
   * Initialize the LeftMenu helper.
   * 
   * @param {Object} eventEmitter - An object implementing an .emit(event, data) method (e.g., 'mitt', Node EventEmitter, or simple facade).
   * @param {Object} config - Configuration options for selectors and hidden classes.
   */
  static init(eventEmitter = null, config = {}) {
    this.eventEmitter = eventEmitter;
    this.config = Object.assign({
        leftPanelSelector: '.js_left_panel',
        rightPanelSelector: '.js_right_panel',
        hiddenCss: ['hidden-md', 'hidden-xs']
    }, config);
    this.visible = true;
    
    // Check initial state
    if (typeof document !== 'undefined') {
        const leftElem = document.querySelector(this.config.leftPanelSelector);
        if (leftElem) {
            const display = leftElem.style.display;
            if (display === "" || display === "inline-block") {
              this.emit("left-menu-on-show");
              this.visible = true;
            } else {
              this.emit("left-menu-on-hide");
              this.visible = false;
            }
        }
    }
  }

  static emit(event, data) {
    if (this.eventEmitter && typeof this.eventEmitter.emit === 'function') {
        this.eventEmitter.emit(event, data);
    }
  }

  static isVisible() {
    return this.visible;
  }

  static toggleShow(show) {
    if (typeof document === 'undefined') return;

    let leftElem = document.querySelector(this.config.leftPanelSelector);
    // Right elem selector provided in config but not used in original logic, keeping for future/ref
    // let rightElem = document.querySelector(this.config.rightPanelSelector); 

    if (!leftElem) return;

    let display = leftElem.style.display;
    let width = leftElem.clientWidth;

    //if it's visible then hide it.
    if ((display === "" || display === "inline-block") && width !== 0) {
      this.visible = false;
      leftElem.style.display = "none";
      this.emit("left-menu-on-hide");
    } else {
      this.visible = true;
      leftElem.style.display = "";
      this.emit("left-menu-on-show");
    }
  }

  /**
   * Send a generic event to the subscriber.
   * The subscriber (e.g. Admin UI Kit) must have passed an eventEmitter during init().
   * 
   * @param {string} event - The event name to dispatch (e.g., "my-custom-event")
   * @param {*} data - Optional payload to send with the event
   */
  static dispatch(event, data = null) {
    this.emit(event, data);
  }

  /**
   * Request the host application to re-fetch and reload the menu data.
   * Useful when permissions change or modules are updated.
   * Triggers the "re-fetch-modules" event.
   */
  static reload() {
    this.emit("re-fetch-modules");
  }
}

