## Development Notes

### Landmarks modifications &mdash; 13 Oct 2015

Problem: According to Steve Faulkner's [ARIA in HTML](https://specs.webplatform.org/html-aria/webspecs/master/) document that specifies default ARIA landmarks roles for HTML 5.1 elements, a `header` or `footer` element should only be considered a `banner` or `contentinfo` landmark, respectively, when it is not a descendant of an `article` or `section` element. However, the criteria we had been using required that `header` or `footer` be a top-level element, i.e., a child of the `body` element, to be considered a landmark.

Solution: Modify the logic for `banner` and `contentinfo` landmarks to follow the evolving HTML 5.1
specification.
* Added `isDescendantOf` function in `dom.js`
* Added code within `addNodes` in `dom.js` that calls a filter function, if defined, on each element in the list returned by a target's selector. Thus, taking the example of the selector 'header, [role="banner"]', all `header` elements are selected initially, but of these, the ones that are descendants of `article` or `section` are removed from the list before it undergoes its final processing, by means of the filter function `isBanner`.
* Added filter functions, `isBanner` and `isContentinfo`, and referenced them in the `banner` and `contentinfo` target objects in `landmarks.js` to implement the filtering criteria defined in the HTML 5.1 default landmark roles requirements referenced above.

### Completed

* `forms.js` handles the accessible name calculations listed in `accname.md`.
* `forms.js` now handles nested fieldsets in accessible name calculation.
* All bookmarklets call the `isVisible` function when adding overlays.
