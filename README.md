# bookmarklets

Highlight classes of elements on a web page that relate to accessibility
requirements, including:

* Forms (work in progress)
* Headings
* Landmarks

Instructions for using the web accessibility bookmarklets:

* An outlined area (e.g., a heading outline with label 'h2') is referred
  to as an overlay. It has the same geometry as the element it outlines.
* Hovering over an overlay will display a tooltip with information on
  the underlying element's type, label, text content or accessible name.
* You can move an overlay with mouse drag and drop.
* Double clicking an overlay will move it back to its original position.
* The above actions can be blocked if one overlay completely obscures
  another. By moving the obscuring overlay out of the way, the above
  actions (e.g., moving, hovering) will be enabled on the bottom overlay.
* The last overlay that was moved has the highest z-index of all overlays.
  Thus if you move a smaller overlay on top of a larger one, the smaller
  overlay remains accessible by mouse actions such as drag and drop (until
  the larger one is moved).

Note: A bookmarklet is a JavaScript snippet that can be run within a web
browser and that typically performs an action related to the currently
loaded web page.
