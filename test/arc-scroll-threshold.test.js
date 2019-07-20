import { fixture, assert, aTimeout } from '@open-wc/testing';
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import '../arc-scroll-threshold.js';

const style = document.createElement('style');
style.innerHTML = `#scrollingRegion {
  width: 200px;
  height: 200px;
  overflow: auto;
  background: green;
}
.content {
  height: 2000px;
  width: 2px;
  background-color: gray;
}`;
document.head.appendChild(style);

describe('<arc-scroll-threshold>', () => {
  async function trivialScrollThresholdFixture() {
    return (await fixture(`<arc-scroll-threshold id="scrollingRegion">
      <div class="content"></div>
    </arc-scroll-threshold>`));
  }

  async function trivialDocumentScrollingFixture() {
    return (await fixture(`<arc-scroll-threshold scrolltarget="document">
      <div class="content"></div>
    </arc-scroll-threshold>`));
  }

  describe('basic features', function() {
    let scrollThreshold;
    beforeEach(async function() {
      scrollThreshold = await trivialScrollThresholdFixture();
      scrollThreshold._scrollDebouncer = 1;
    });

    afterEach(function() {
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop = 0;
    });

    it('default', function() {
      assert.equal(
        scrollThreshold._defaultScrollTarget,
        scrollThreshold,
        '_defaultScrollTarget');
      assert.equal(scrollThreshold.scrollTarget, scrollThreshold, 'scrollTarget');
      assert.equal(scrollThreshold.upperThreshold, 100, 'upperThreshold');
      assert.equal(scrollThreshold.lowerThreshold, 100, 'lowerThreshold');
      assert.equal(scrollThreshold.horizontal, false, 'horizontal');
      assert.equal(
        window.getComputedStyle(scrollThreshold.scrollTarget)
        .overflow,
        'auto',
        'overflow');
    });

    it('upper-threshold event', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.addEventListener('upper-threshold', function() {
        eventTriggered = scrollThreshold.upperTriggered;
      });
      assert.isTrue(scrollThreshold.upperTriggered, 'Before scroll upperTriggered');
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop = scrollThreshold._scrollTop + 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('onupperthreshold setter', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.onupperthreshold = function() {
        eventTriggered = scrollThreshold.upperTriggered;
      };
      assert.typeOf(scrollThreshold.onupperthreshold, 'function');
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop = scrollThreshold._scrollTop + 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('clears onupperthreshold', async () => {
      await aTimeout();
      let called = false;
      function f() {
        called = true;
      }
      scrollThreshold.onupperthreshold = f;
      scrollThreshold.onupperthreshold = null;
      scrollThreshold._scrollTop = scrollThreshold._scrollTop + 10;
      await aTimeout(40);
      assert.isFalse(called);
    });

    it('lower-threshold event', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.addEventListener('lower-threshold', function() {
        eventTriggered = scrollThreshold.lowerTriggered;
      });
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('onlowerthreshold setter', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.onlowerthreshold = function() {
        eventTriggered = scrollThreshold.lowerTriggered;
      };
      assert.typeOf(scrollThreshold.onlowerthreshold, 'function');
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('clears onlowerthreshold', async () => {
      await aTimeout();
      let called = false;
      function f() {
        called = true;
      }
      scrollThreshold.onlowerthreshold = f;
      scrollThreshold.onlowerthreshold = null;
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      await aTimeout(40);
      assert.isFalse(called);
    });

    it('clearTriggers', async function() {
      await aTimeout();
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.upperTriggered);
    });

    it('checkScrollThresholds', async function() {
      await aTimeout();
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check triggers');
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.lowerTriggered, 'reset triggers');
    });

    it('horizontal', async function() {
      await aTimeout();
      scrollThreshold.horizontal = true;
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollLeft = scrollThreshold.scrollTarget.scrollWidth;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check lowerTriggered');
      scrollThreshold._scrollLeft = 0;
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.upperTriggered, 'upperTriggered');
    });
  });

  describe('document scroll', function() {
    let scrollThreshold;
    beforeEach(async function() {
      scrollThreshold = await trivialDocumentScrollingFixture();
      scrollThreshold._scrollDebouncer = 1;
    });

    afterEach(function() {
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop = 0;
    });

    it('default', async function() {
      await aTimeout();
      assert.equal(
        scrollThreshold.scrollTarget, scrollThreshold._doc, 'scrollTarget');
      assert.equal(scrollThreshold.upperThreshold, 100, 'upperThreshold');
      assert.equal(scrollThreshold.lowerThreshold, 100, 'lowerThreshold');
      assert.equal(scrollThreshold.horizontal, false, 'horizontal');
    });

    it('upper-threshold event', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.addEventListener('upper-threshold', function() {
        eventTriggered = scrollThreshold.upperTriggered;
      });
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop = scrollThreshold._scrollTop + 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('lower-threshold event', async function() {
      await aTimeout();
      let eventTriggered;
      scrollThreshold.addEventListener('lower-threshold', function() {
        eventTriggered = scrollThreshold.lowerTriggered;
      });
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('clearTriggers', async function() {
      await aTimeout();
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.upperTriggered);
    });

    it('checkScrollThresholds', async function() {
      await aTimeout();
      scrollThreshold._scrollTop = scrollThreshold.scrollTarget.scrollHeight;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check triggers');
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.lowerTriggered, 'reset triggers');
    });

    it('horizontal', async function() {
      await aTimeout();
      scrollThreshold.horizontal = true;
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollLeft = scrollThreshold.scrollTarget.scrollWidth;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check lowerTriggered');
      scrollThreshold._scrollLeft = 0;
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.upperTriggered, 'upperTriggered');
    });
  });

  a11ySuite('Normal state', `<arc-scroll-threshold id="scrollingRegion">
    <div class="content"></div>
  </arc-scroll-threshold>`);
});
