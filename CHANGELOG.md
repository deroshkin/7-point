# CHANGELOG

## 10/28/2020

### New Features

* Export all data as a json file and load from a json file.
* The Outline table is now an honest striped table where there is no plot item listed, used to be only for
* Introduced the ability to edit plot lines in the "Table of Plot Lines" tab, any changes will automatically propagate
to both the "Outline Generator" and the "Outline" tabs

### Bugfixes

* Fixed issues with multi-line plot names / plot items, used to be that only one line break was observed in the tables.
* Fixed escapes in CSV export, multi-line items now work, and quotes are properly escaped.

### Under the Hood

* CSV export moved to file_ops.js

## 10/27/2020

First public version