# DEPRECATED

Use the `@anypoint-web-components/awc` module instead.

-----

This is a port of [iron-scroll-threshold](https://github.com/PolymerElements/iron-scroll-threshold) that works with LitElement and plain WC.

`arc-scroll-threshold` is a utility element that listens for `scroll` events from a scrollable region and dispatches events to indicate when the scroller has reached a pre-defined limit, specified in pixels from the upper and lower bounds of the scrollable region.
This element may wrap a scrollable region and will listen for `scroll` events bubbling through it from its children. In this case, care should be taken that only one scrollable region with the same orientation as this element is contained within. Alternatively, the `scrollTarget` property can be set/bound to a non-child scrollable region, from which it will listen for events.

Once a threshold has been reached, a `lower-threshold` or `upper-threshold` event are fired, at which point the user may perform actions such as lazily-loading more data to be displayed. After any work is done, the user must then clear the threshold by calling the `clearTriggers` method on this element, after which it will begin listening again for the scroll position to reach the threshold again assuming the content in the scrollable region has grown. If the user no longer wishes to receive events (e.g. all data has been exhausted), the threshold property in question (e.g. `lowerThreshold`) may be set to a falsy value to disable events and clear the associated triggered property.

## Example

### In a Polymer template

```javascript
static get template() {
  return html`
  <arc-scroll-threshold on-lower-threshold="loadMoreData">
    <template is="dom-repeat" items="[[items]]">
      ...
    </template>
  </arc-scroll-threshold>`;
}

async loadMoreData() {
  // loadData() loads some API data from somewhere
  const data = await loadData();
  // Assuming `items` contains list of rendered items
  this.items = [...this.items, ...data];
}
```

### In a LitElement template

```javascript
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/arc-scroll-threshold/arc-scroll-threshold.js';

class SampleElement extends LitElement {
  render() {
    const { items } = this;
    return html`
    <arc-scroll-threshold @lower-threshold="${this.loadMoreData}">
    ${items.map((item) => html`...`)}
    </arc-scroll-threshold>`;
  }

  async loadMoreData() {
    // loadData() loads some API data from somewhere
    const data = await this.loadData();
    // Assuming `items` contains list of rendered items
    this.items = [...this.items, ...data];
  }
}
customElements.define('sample-element', SampleElement);
```

### Imperative use

```html
<script type="module" src="@advanced-rest-client/arc-scroll-threshold/arc-scroll-threshold.js"></script>
<arc-scroll-threshold></arc-scroll-threshold>
<section id="list"></section>
<script>
{
  async function loadMore() {
    const data = await loadData();
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
      fragment.appendChild(createListItemElement(item))
    })
    document.getElementById('#list').appendChild(fragment)
  }
  document.querySelector('arc-scroll-threshold').onlowerthreshold = () => {
    loadMore();
  };
}
</script>
```

## Development

```sh
git clone https://github.com/@advanced-rest-client/arc-scroll-threshold
cd arc-scroll-threshold
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
