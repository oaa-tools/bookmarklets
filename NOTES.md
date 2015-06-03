## Development Notes

### `isVisible` function

* Is now recursive, such that when a form is hidden, it detects that all
  of its elements are hidden.
* How to determine visibility based on element geometry?
* To compare OAA Library algorithm, search for `DOMElementComputedStyle`

#### Questions
* Should `aria-hidden` be used to determine visibility?

### `forms.js` accessible name calculation

#### Notes
* Each calculation first checks the attributes `aria-labelledby` and
  `aria-label`, in that order. This is assumed in the calculations list
  below.
* Each calculation uses the next item specified only when the previous
  item has produced no content.
* If form-related elements are contained in a `fieldset` that contains
  a `legend`, the `legend` content, if any, is prepended to the element's
  accessible name (recursively).
* When a calculation specifies use `label`, the implied methods are
  `for`/`id` and encapsulation.
* When multiple attributes are used, precedence is in the order specified.

#### Calculations
* `input` `type=` `text`, `password`, `search`, `tel`, `email`, `url`
* `textarea`
  * use `label`, then attributes `placeholder`, `title`
* `select`, `output`
  * use `label`, then attribute `title`
* `button`
  * use text content of `button` element, then attribute `title`
* `input` `type=` `image`
  * use attributes `alt`, `value`, `title`
* `input` `type=` `button`
  * use attributes `value`, `title`
* `input` `type=` `submit`, `reset`
  * use attribute `value`, then default of Submit or Reset, then
    attribute `title`
* `input` `type=` all types not listed above
  * use `label`, then attribute `title`

#### Questions
* When the `aria-labelledby` attribute is specified on an element, and an
  element referenced by an IDREF has an `aria-label` attribute, does it
  take precedence over text content and `title`?
* How to implement the calculation that takes into account input type=text,
  menu, and select elements.

### Drag-and-drop and tooltip behaviors
* The drag-and-drop and tooltip activation behaviors are now available only
  on the label div of each overlay (the solid-color rectangle in the top-
  right corner). This change was made for all bookmarklets for the following
  reasons:
  * In some cases, users seemed surprised and/or confused that they could no
    longer interact with areas of the underlying page covered by overlays.
    Obviously, this was more of a problem when an overlay covered a large
    area of the page.
  * Tooltips and dragging become available on all visible labels, even when
    they are overlaid by another bookmarklet overlay (as long as some portion
    of the label is exposed).
* To accomplish this, the CSS property `pointer-events: none` is set on
  the parent overlay and `pointer-events: auto` is set on the label div.
* Note: IE versions 10 and earlier do not support the CSS `pointer-events`
  property. In those versions, the target area for drag-and-drop and tooltip
  activation will still be the label div, but an overlay will prevent the
  user from interacting with underlying page elements, including labels of
  other overlays.

### Ideas

* May want to add an 'info' overlay &mdash; a medium-sized icon with 'i'
  label. When you hover over it, an info dialog is displayed. This could
  have multiple uses:
  * When the bookmarklet finds target elements, the info overlay could
    include information on hidden elements, and/or the total number of
    elements found.
  * It could take the place of the message dialog used to report that
    no target elements were found.

### Completed

* `forms.js` handles the accessible name calculations listed above.
* `forms.js` now handles nested fieldsets in accessible name calculation.
* All bookmarklets call the `isVisible` function when adding overlays.
