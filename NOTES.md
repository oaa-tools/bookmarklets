## Development Notes

### `isVisible` function

* Is now recursive, such that when a form is hidden, all of its elements
  are hidden.
* How to determine visibility based on element geometry?
* To compare OAA Library algorithm, search for `DOMElementComputedStyle`

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

* `forms.js` now handles nested fieldsets in accessible name calculation
