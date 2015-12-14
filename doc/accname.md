## Notes on Accessible Name Calculations

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

#### Embedded Controls: Roles, Elements and Native Semantics

Role: textbox
* `input [email|password|search|tel|text|url]` -> getValue
* `textarea` -> getElementContents

Role: combobox
* `input [email|search|tel|text|url]` -> getValue

Role: listbox
* `datalist` -> getSelectedOption
* `select` -> getAllSelectedOptions

Role: slider
* `input [range]` -> getValue

Role: spinbutton
* `input [number]` -> getValue

Functions:
* getValue: use `HTMLInputElement` interface: `value` property
* getSelectedOption: loop through `option` elements, get text contents of first with `selected` property
* getAllSelectedOptions: use `selectedOptions` property, which is an HTMLCollection


#### Questions
* When the `aria-labelledby` attribute is specified on an element, and an
  element referenced by an IDREF has an `aria-label` attribute, does it
  take precedence over text content and `title`?
* How to implement the calculation that takes into account input type=text,
  menu, and select elements.
