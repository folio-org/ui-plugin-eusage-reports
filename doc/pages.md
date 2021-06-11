# Summary of pages in the title-matching function

> WARNING. DO NOT READ THIS FILE.
> It is suitable only for Mike's eyes.

Four pages are involved in the title-matching part of the eUsage reporting work. They are as follows, based on [the somewhat outdated mockups](https://wiki.folio.org/display/RM/eUsage+Reports+Harvest+Summary+and+Results) and [the even more outdated UXPROD](https://issues.folio.org/browse/UXPROD-2860).


## 1. eUsage Data Provider (UDP)

This page is provided by the eUsage app (`ui-erm-usage`). [[Example](https://folio-snapshot.dev.folio.org/eusage/view/9362de60-f8b2-4073-bee3-01fa5fc8462f?filters=harvestingStatus.active&sort=label)]

The relevant section is **Matching summary**, which appears between **Harvesting configuration** and **COUNTER statistics** when provided by a plugin of type `ui-agreements-extension` invoked with a data object containing `op` equal to `match-names`. One such plugin is of course `ui-plugin-eusage-reports`. This is what is illustrated by the first page in the mockup.

Clicking on any of the four record-counts (Records loaded, Matches, Unmatched or Ignored) will take the user to the appropriate tab in ...


## 2. eUsage title matcher

This is a separate route which will somehow need to be plumbed into the eUsage app. It contains four tabs corresponding to the four categories of titles linked from the first page. This is what is illustrated by the second page in the mockup.

The UX here is modelled on the way that when looking [at a given user within Users app](https://indexdata-test.folio.indexdata.com/users/preview/47a72722-eb72-4d77-bfc5-cbc9ec39f4a2?filters=active.active&query=charles&sort=name), opening the **Loans** accordion and clicking on either "_n_ open loans" or "_m_ closed loans" takes you to [a new whole-screen page](https://indexdata-test.folio.indexdata.com/users/47a72722-eb72-4d77-bfc5-cbc9ec39f4a2/loans/open) listing loans, with tabs for the open and closed ones.

Each title row has an "Action" column, which pops up a menu including either "Create match" or "Edit match", as well as "Ignore" or "Stop ignoring". Selecting create or edit match takes the user to ...


## 3. Title match editor

This is search-and-filter popup similar to the user-in-user popup used to select a Patron or Proxy in the Users app. This is what is illustrated by the second page in the mockup.

This apparently already exists, having been implemented by K-Int. They will give us a link to a place where we can see it in action.

> **Owen Stephens** _16 minutes ago_  
> The place we have this in the UI at the moment is from the ERM Comparisons app. To see how this works in the UI
https://folio-snapshot.dev.folio.org/comparisons-erm?sort=-started and then click “Select package” in the search & filter panel
>
> It should be the same plugin but pass a filter of 
> class==org.olf.kb.TitleInstance
> instead of
> class==org.olf.kb.Pkg


## 4. Title record

If, on the eUsage title matcher, the user simply clicks on one of the titles, then the app simply links to the page about that title -- something that is [already implemented](https://indexdata-test.folio.indexdata.com/erm/eresources/9dee464f-c333-449b-884b-2693c77d877a?filters=publicationType.Journal&sort=name)


