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
    this.collapsed = false;
    this.storageKey = 'htcms_sidebar_collapsed';
    
    // Check stored state
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored !== null) {
            this.collapsed = JSON.parse(stored);
        }
    }
    
    // Check initial state from DOM (overrides storage if forced in Blade/HTML)
    if (typeof document !== 'undefined') {
        const leftElem = document.querySelector(this.config.leftPanelSelector);
        if (leftElem) {
            const display = leftElem.style.display;
            if (display === "none") {
              this.visible = false;
              this.emit("left-menu-on-hide");
            } else {
               this.visible = true;
               this.emit("left-menu-on-show");
               
               // Apply stored state to DOM
               if (this.collapsed) {
                   leftElem.classList.add('is-collapsed');
                   this.emit("left-menu-on-collapse");
               } else {
                   leftElem.classList.remove('is-collapsed');
                   this.emit("left-menu-on-expand");
               }

               // Final check if DOM has it forced
               if (leftElem.classList.contains('is-collapsed')) {
                   this.collapsed = true;
               }
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

  static isCollapsed() {
      return this.collapsed;
  }

  static toggleCollapse(collapsed) {
      if (typeof document === 'undefined') return;
      let leftElem = document.querySelector(this.config.leftPanelSelector);
      if (!leftElem) return;

      this.collapsed = (collapsed !== undefined) ? collapsed : !this.collapsed;
      
      // Persist state
      if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.storageKey, JSON.stringify(this.collapsed));
      }

      if (this.collapsed) {
          leftElem.classList.add('is-collapsed');
          this.emit("left-menu-on-collapse");
      } else {
          leftElem.classList.remove('is-collapsed');
          this.emit("left-menu-on-expand");
      }
      return this.collapsed;
  }

  static toggleShow(show) {
    if (typeof document === 'undefined') return;

    let leftElem = document.querySelector(this.config.leftPanelSelector);
    if (!leftElem) return;

    if (show === false || (show === undefined && this.visible)) {
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

