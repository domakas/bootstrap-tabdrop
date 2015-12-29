bootstrap-tabdrop angular edition
=================

A dropdown tab tool for @twitter bootstrap angular forked from Stefan Petre's (of eyecon.ro), improvements by @jschab, @josephdburdick and @domakas

The dropdown tab appears when your tabs do not all fit in the same row.

Original site and examples: http://www.eyecon.ro/bootstrap-tabdrop/ 

Added functionality: Displays the text of an active tab selected from the dropdown list instead of the text option on the dropdown tab (improved).

Added functionality: Allows customizable offset to determine whether tab is overflown or not.

Added functionality: Works as angular directive.

## Requirements

* [Bootstrap](http://twitter.github.com/bootstrap/) 2.0.4+
* [jQuery](http://jquery.com/) 1.7.1+
* [ui-bootstrap](http://angular-ui.github.io/bootstrap/) 0.12.1+

## Example

Use as angular directive directly on tab element:
```html
<ul class="nav nav-tabs" tabdrop>
    <li>...</li>
</ul>
```

### Options

All options from original lib is supported. All options are passed to directive directly