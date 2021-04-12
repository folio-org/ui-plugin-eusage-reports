CSV files in this directory are use to provide mocked data until the
mod-eresource-reports WSAPI is available. We have:

* `Use by publication year - viz.csv` -- exported from the **viz** sheet of [Use by publication year](https://docs.google.com/spreadsheets/d/14YLLj24VcSlW2XqpXW-ypaMu9bynKxITcui7tYbibh8/edit#gid=503991216)
* `Use by month - Viz.csv` -- exported from the **viz** sheet of [Use by month](https://docs.google.com/spreadsheets/d/1E5Waultv6fujL8s5dijKCKsqmlfxy1GmrlUy27y5dyA/edit#gid=583380332)
* `Cost per use - Viz.csv` -- exported from the **viz** sheet of [Cost per use](https://docs.google.com/spreadsheets/d/1FfVzo7_lKJrIkzZJgd8coODKI5Ut10VUYEDQlIpTqzs/edit#gid=1957414023)

In general, the format is:
* First line: names of fields
* Second and subsequent lines: records
* First line with an empty initial column: end of data (all subsequent rows are ignored)

But, annoyingly, `Use by month - Viz.csv` has two additional rows after the header, which also need to be ignored.
