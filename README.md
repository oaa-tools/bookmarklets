# bookmarklets

Highlight classes of elements on a web page that relate to accessibility
requirements, including:

* Landmarks
* Headings
* Images
* Lists
* Forms (work in progress)

To install the bookmarklets, please visit the [Accessibility Bookmarklets website](https://accessibility-bookmarklets.org).

Instructions for using the web accessibility bookmarklets:

* An outlined area (e.g., a heading outline with label 'h2') is referred
  to as an overlay. It has the same geometry as the element it outlines.
* Hovering over the label of an overlay (the solid-color rectangle in the
  top-right corner) will display a tooltip with information on the
  underlying element's type, label, text content or accessible name.
* You can move an overlay with mouse drag-and-drop using its label as the
  drag handle.
* After moving an overlay, double clicking its label will move the overlay
  back to its original position.
* The last overlay that was clicked or moved has the highest z-index of all
  overlays. Thus if the label of one overlay is partially obscured by the
  label of another, clicking the partially obscured label will expose the
  entire label.
* In some cases, one overlay may completely obscure another, hiding even
  the label of the other overlay. We plan to address this issue by adding
  page-level information that indicates how many overlays of each type
  were found on the page.

Note: A bookmarklet is a JavaScript snippet that can be run within a web
browser and that typically performs an action related to the currently
loaded web page.
