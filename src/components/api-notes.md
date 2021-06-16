# Notes on `mod-eusage-reports` WSAPI

RAML is at https://github.com/folio-org/mod-eusage-reports/blob/master/src/main/resources/openapi/eusage-reports-1.0.yaml
       and locally checked out at ../../../../other/mod-eusage-reports/src/main/resources/openapi/eusage-reports-1.0.yaml

It contains five WSAPI endpoints, all within `/eusage-reports/`

* `/eusage-reports/report-titles` (GET, POST)
* `/eusage-reports/report-titles/from-counter` (POST)
* `/eusage-reports/title-data` (GET)
* `/eusage-reports/report-data` (GET)
* `/eusage-reports/report-data/from-agreement` (POST)

Two of these are refinements of the three basic requests.

`/eusage-reports/report-titles` is the only one of these calls that accepts parameters -- two optional ones:
* `counterReportId` -- limit titles associated with counter report (UUID)
* `providerId` -- limit titles associated with usage provider (UUID)

