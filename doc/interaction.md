## Notes on Interaction Design

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
