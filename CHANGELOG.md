# Change history for ui-plugin-eusage-reports

## 2.4.0 (IN PROGRESS)
* Add support for Stripes v8. Fixes [UIPER-105](https://issues.folio.org/browse/UIPER-105).

## [2.3.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.3.0) (2022-10-25)

* Replace `babel-eslint` with `@babel/eslint-parser`. Fixes [UIPER-93](https://issues.folio.org/browse/UIPER-93).
* Move `prop-types` from peer-dependency to regular dependency. Fixes [UIPER-98](https://issues.folio.org/browse/UIPER-98).
* "eUsage reports" accordion is not displayed, if no Usage data provider is linked. Fixes [UIPER-99](https://issues.folio.org/browse/UIPER-99).
* "Matching summary" accordion is closed by default. Fixes [UIPER-100](https://issues.folio.org/browse/UIPER-100).
* Test no longer relies on external api endpoint. Fixes [UIPER-101](https://issues.folio.org/browse/UIPER-101).

## [2.2.3](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.2.3) (2021-10-27)

* Many, many more tests. Fixes UIPER-28.
* Dependency on `eusage-reports` Okapi interface is no longer optional. Fixes UIPER-64.
* When fetching data to plot charts (but not for CSV downloads), item data is omitted. Fixes UIPER-65.

## [2.2.2](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.2.2) (2021-10-22)

* Create new permission governing use of the match-editor, with all necessary subpermissions. Fixes UIPER-87.

## [2.2.1](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.2.1) (2021-10-19)

* Invert the sense of `<>` and `=` when used with empty terms to mean "field is defined" and "field is not defined", matching the corresponding change made in mod-eusage-reports v1.0.1 to match RMB behaviour. Fixes UIPER-85.
* Match-editor requests sorting by COUNTER-report title. Fixes UIPER-86.
* Add some more unit tests. Towards UIPER-28.
* Update some translations.
* Remove redundant dependency on `stripes-webpack`.

## [2.2.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.2.0) (2021-10-08)

* "eUsage reports: charts may be viewed" (`plugin-eusage-reports.view-charts`) permission now includes all relevant back-end permissions. Fixes the last part of UIPER-74.
* Resolve method of displaying more results in eUsage titles screen. We now use `<SearchAndSortQuery>` to present the Match Editor. Fixes UIPER-16.

## [2.1.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.1.0) (2021-10-06)

* "eUsage reports" accordion in the Agreements app is closed by default. Fixes UIPER-70.
* New permission, "eUsage reports: charts may be viewed" (`plugin-eusage-reports.view-charts`), determines whether the "eUsage reports" accordion is visible. Fixes UIPER-74.
* Send `format` parameter as part of cost-per-use charting requests. Fixes UIPER-79.
* Rename report and picker labels. Fixes UIPER-76.

## [2.0.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.0.0) (2021-10-06)

* Now requires v7 of the Stripes framework, with questionable support for v6 dropped. (The strange release deadlines for Kiwi meant that we had to release a v7-compatible version of this module before v7 was itself released, but now that it's out we can make things simpler and more reliable.)

## [1.2.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v1.2.0) (2021-09-27)

* Upgrade to run under either v6 or v7 of the Stripes framework. Fixes UIPER-75.

## [1.1.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v1.1.0) (2021-09-24)

* First proper release.

## [1.0.0](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v1.0.0) (2021-07-05)

* Initial vacuous release created so that yarn will recognise this package in folioci

