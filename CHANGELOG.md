# Change history for ui-plugin-eusage-reports

## [2.0.1](https://github.com/folio-org/ui-plugin-eusage-reports/tree/v2.0.1) (IN PROGRESS)

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

