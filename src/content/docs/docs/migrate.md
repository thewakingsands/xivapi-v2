---
title: Migrating to V2
prev: false
next: false
---

XIVAPI v2 represents a from-scratch reimplementation of the service, with a
heavy focus on stability for consumers, and providing a solid platform for years
to come. To achieve this, it does not attempt to maintain backwards compatibilty
with v1.

This document is intended to outline the key differences between v1 and v2, and
assist in efforts to migrate to the new version. For full documentation of the
v2 API, refer to the [guides] and [api reference].

[guides]: /docs/guides/
[api reference]: /api/docs

## Game Content

Game data, known as "content" and "indexes" in the v1 API, is consistently
referred to as "sheets" throughout v2. This, along with a few other updated
names outlined below, aligns the API with common terminology used by the FFXIV
developer community.

Sheet data access has seen several significant changes, however has _largely_
similar semantics, due to sheets being a concrete concept inherited from the
game files.

### Columns and Filtering

Throughout the v2 API and its documentation, "field" is used to refer to what V1
called a "column". This extends to the `fields` object in responses, and the
`fields=` filtering url parameter.

Filtering fields remains largely similar to v1, with the exception of arrays,
which are represented through brackets.

```json
// v1
columns=Array.*.Field
// v2
fields=Array[].Field
```

### Change of Schema

V2 utilises [EXDSchema] as its [schema]. EXDSchema inherits the vast bulk of the
names and mappings found in the SaintCoinach schema, which was used by v1 - so
most fields should be the same or similar to what you're accustom to.

If a field isn't where you expected, you can check the full structure of the
schema for a sheet by visiting the row endpoint without a field filter, as
outlined in [the sheets documentation][sheets filtering]. Fields may have
shuffled slightly to better represent their structure in the game files.

[EXDSchema]: https://github.com/xivdev/EXDSchema
[schema]: /docs/guides/concepts/#schemas
[sheets filtering]: /docs/guides/sheets/#filtering

### Transient Fields

While some fields will have moved due to the schema update outlined above,
others may appear to be completely missing. In many cases, these are "computed"
fields - that is, fields that do not actually exist on a given sheet, but are
instead derived based on other data.

In a few instances, these fields actually belong to a seperate sheet, typically
including the term "transient" in its name. These fields can be included in
responses through the `transient=` URL parameter, see the [Transient Sheets]
documentation for further information.

[Transient Sheets]: /docs/guides/sheets/#transient-sheets

### Other Computed Fields

In most other cases, the computed fields are derived in a manner that is
difficult to represent in a maintainable manner. For this reason, the v2 API
does not support further computed fields.

If one or more of these computed fields is critical to your use case, please
reach out on Discord - there may be alternative ways to construct semantically
equivalent data. Alternatively, you may be able to refer to the implementation
of these fields in the [v1 codebase][v1 computed] to replicate it with your
consumption of v2.

[v1 computed]: https://github.com/xivapi/xivapi.com/tree/master/src/Service/DataCustom

### Game Content Links

The v1 API provided a reverse relationship lookup, exposed as the
`GameContentLinks` field on rows. At present, v2 does not have any equivalent
functionality, however it is a feature we're interested in adding. As v2 is
functionally a "lower level" system than v1, it may take a while for a viable
approach for this to be implemented.

Akin to computed fields, please reach out if this functionality is critical to
your use case, as alternatives may exist.

## Search

V2 has a single, powerful search endpoint that combines much of the
functionality found in v1's query string, filters, and advanced Elasticsearch
queries into one search query syntax.

An introduction to this new syntax can be found in the [Searching Sheets] guide.

[Searching Sheets]: /docs/guides/search/

## Lodestone

V1 provided endpoints that surfaced data obtained from Lodestone, however these
endpoints saw degraded availability due to the nature of the scraping being
performed. By late 2023, they were effectively rendered non-functional.

There are no current plans to re-introduce Lodestone endpoints in v2. For
alternatives, please see the [Open Souce][lodestone alternatives] page, which
lists a few tools and libraries that can be used to obtain this information.

[lodestone alternatives]: /docs/software#lodestone-data
