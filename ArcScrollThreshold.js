import { html, css, LitElement } from 'lit-element';
import { ArcScrollTargetMixin } from '@advanced-rest-client/arc-scroll-target-mixin';
/**
 * A port of `iron-scroll-threshold` element.
 *
 * @customElement
 * @demo demo/index.html Document scroll
 * @demo demo/scrolling-region.html Scroll region
 * @demo demo/scrolling-region-decoupled.html Scroll region decoupled
 * @memberof UiElements
 */
export default class ArcScrollThreshold extends ArcScrollTargetMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }`;
  }

  static get properties() {
    return {
      /**
       * Distance from the top (or left, for horizontal) bound of the scroller
       * where the "upper trigger" will fire.
       */
      upperThreshold: { type: Number },
      /**
       * Distance from the bottom (or right, for horizontal) bound of the scroller
       * where the "lower trigger" will fire.
       */
      lowerThreshold: { type: Number },
      /**
       * True if the orientation of the scroller is horizontal.
       */
      horizontal: { type: Boolean }
    };
  }
  /**
   * Read-only value that tracks the triggered state of the upper threshold.
   * @return {Boolean}
   */
  get upperTriggered() {
    return this._upperTriggered;
  }
  /**
   * Read-only value that tracks the triggered state of the lower threshold.
   * @return {Boolean}
   */
  get lowerTriggered() {
    return this._lowerTriggered;
  }

  get _upperTriggered() {
    return this.__upperTriggered;
  }

  set _upperTriggered(value) {
    this.__upperTriggered = value;
    this.dispatchEvent(new CustomEvent('upper-changed', {
      detail: {
        value
      }
    }));
  }

  get _lowerTriggered() {
    return this.__lowerTriggered;
  }

  set _lowerTriggered(value) {
    this.__lowerTriggered = value;
    this.dispatchEvent(new CustomEvent('lower-changed', {
      detail: {
        value
      }
    }));
  }

  get horizontal() {
    return this._horizontal;
  }

  set horizontal(value) {
    const old = this._horizontal;
    if (old === value) {
      return;
    }
    this._horizontal = value;
    this._initCheck();
  }

  get _defaultScrollTarget() {
    return this;
  }

  get _scrollDebouncer() {
    return this.__scrollDebouncer || 200;
  }
  /**
   * Sets value for scroll debounce timeout.
   * @param {Nymber} value Scroll computation timeout value.
   */
  set _scrollDebouncer(value) {
    this.__scrollDebouncer = value;
  }
  /**
   * @return {Function|null|undefined} Prefiously registered callback for `lower-threshold`.
   */
  get onlowerthreshold() {
    return this._onlowerthreshold;
  }
  /**
   * Registers event listener for `lower-threshold` event.
   * @param {?Function} value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onlowerthreshold(value) {
    if (this._onlowerthreshold) {
      this.removeEventListener('lower-threshold', this._onlowerthreshold);
    }
    if (typeof value !== 'function') {
      this._onlowerthreshold = null;
      return;
    }
    this._onlowerthreshold = value;
    this.addEventListener('lower-threshold', value);
  }
  /**
   * @return {Function|null|undefined} Prefiously registered callback for `upper-threshold`.
   */
  get onupperthreshold() {
    return this._onupperthreshold;
  }
  /**
   * Registers event listener for `upper-threshold` event.
   * @param {?Function} value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onupperthreshold(value) {
    if (this._onupperthreshold) {
      this.removeEventListener('upper-threshold', this._onupperthreshold);
    }
    if (typeof value !== 'function') {
      this._onupperthreshold = null;
      return;
    }
    this._onupperthreshold = value;
    this.addEventListener('upper-threshold', value);
  }

  constructor() {
    super();
    this.upperThreshold = 100;
    this.lowerThreshold = 100;
    this.horizontal = false;
    this._upperTriggered = false;
    this._lowerTriggered = false;
  }

  connectedCallback() {
    /* istanbul ignore next */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._initCheck();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  disconnectedCallback() {
    /* istanbul ignore next */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    if (this._thesholdDebouncer) {
      clearTimeout(this._thesholdDebouncer);
      this._thesholdDebouncer = undefined;
    }
    if (this.__initDebouncer) {
      clearTimeout(this.__initDebouncer);
      this.__initDebouncer = undefined;
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  _scrollTargetChanged(value) {
    super._scrollTargetChanged(value, this.isAttached);
    this._setOverflow(value);
  }

  _setOverflow(scrollTarget) {
    this.style.overflow = scrollTarget === this ? 'auto' : '';
    this.style.webkitOverflowScrolling = scrollTarget === this ? 'touch' : '';
  }

  _scrollHandler() {
    if (this._thesholdDebouncer) {
      return;
    }
    this._thesholdDebouncer = setTimeout(() => {
      this._thesholdDebouncer = undefined;
      this.checkScrollThresholds();
    }, this._scrollDebouncer);
  }

  _initCheck() {
    if (!this.isAttached || this.__initDebouncer) {
      return;
    }
    this.__initDebouncer = setTimeout(() => {
      this.__initDebouncer = undefined;
      this.clearTriggers();
      this.checkScrollThresholds();
    });
  }
  /**
   * Checks the scroll thresholds.
   * This method is automatically called by iron-scroll-threshold.
   *
   * @method checkScrollThresholds
   */
  checkScrollThresholds() {
    if (!this.scrollTarget || (this.lowerTriggered && this.upperTriggered)) {
      return;
    }
    const upperScrollValue = this.horizontal ? this._scrollLeft : this._scrollTop;
    const lowerScrollValue = this.horizontal ?
      this.scrollTarget.scrollWidth - this._scrollTargetWidth - this._scrollLeft :
      this.scrollTarget.scrollHeight - this._scrollTargetHeight - this._scrollTop;

    // Detect upper threshold
    if (upperScrollValue <= this.upperThreshold && !this.upperTriggered) {
      this._upperTriggered = true;
      this.dispatchEvent(new CustomEvent('upper-threshold'));
    }
    // Detect lower threshold
    if (lowerScrollValue <= this.lowerThreshold && !this.lowerTriggered) {
      this._lowerTriggered = true;
      this.dispatchEvent(new CustomEvent('lower-threshold'));
    }
  }
  /**
   * Clear the upper and lower threshold states.
   *
   * @method clearTriggers
   */
  clearTriggers() {
    this._upperTriggered = false;
    this._lowerTriggered = false;
  }

  /**
   * Fires when the lower threshold has been reached.
   *
   * @event lower-threshold
   */

  /**
   * Fires when the upper threshold has been reached.
   *
   * @event upper-threshold
   */
}
