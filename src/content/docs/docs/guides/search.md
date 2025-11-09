---
title: Searching Sheets
sidebar:
  order: 4
reference:
  href: /api/docs#tag/search
  description: OpenAPI specification for the search endpoint.
---

The search endpoint finds sheet rows that match a provided query, and sorts them
by relevance.

Much of the API surface of search is shared with the sheet endpoints. This page
focuses on search-specific behavior, please refer to the documentation for
[sheet endpoints] or the search [api reference] for more details.

[sheet endpoints]: /docs/guides/sheets/
[api reference]: /api/docs#tag/search

## Query

The `query` parameter is the core API for search, controlling both result
relevance and filtering. Queries are written in a powerful query language,
outlined below.

Queries are executed against the sheets specified by the `sheets` parameter.

### Clauses

Clauses are the basic building block of queries, performing a comparison of a
field with an expected value. They take the basic form of
`[specifier][operation][value]`, i.e. `Name="Rainbow Drip"`.

<details>
<summary><code>query=Name="Rainbow Drip"</code></summary>

```json wrap "Name=\"Rainbow Drip\"" "Rainbow Drip"
// /api/search?sheets=Action&fields=Name&query=Name="Rainbow Drip"
{
  "results": [
    {
      "row_id": 34688,
      "fields": { "Name": "Rainbow Drip" }
    }
  ]
}
```

</details>

### Specifiers

Similar to [field filters], fields that are nested within structural fields can
be searched by specifying the full path to the field. Dot notation is used for
structs and relationships, and array access notation for arrays.

[field filters]: /docs/guides/sheets/#filtering

<details>
<summary><code>query=ClassJob.Abbreviation="PCT"</code></summary>

```json wrap "ClassJob.Abbreviation=\"PCT\""
// /api/search?sheets=Action&fields=Name&query=ClassJob.Abbreviation="PCT"
{
  "results": [
    {
      "row_id": 34650,
      "fields": { "Name": "Fire in Red" }
    },
    {
      "row_id": 34653,
      "fields": { "Name": "Blizzard in Cyan" }
    },
    // ...
  ]
}
```

</details>

<details>
<summary><code>query=BaseParam[].Name="Spell Speed"</code></summary>

```json wrap "BaseParam[].Name=\"Spell Speed\"" "Spell Speed"
// /api/search?sheets=Item&fields=Name,BaseParam[].Name&query=BaseParam[].Name="Spell Speed"
{
  "results": [
    {
      "row_id": 1973,
      "fields": {
        "Name": "Ul'dahn Wand",
        "BaseParam": [
          { "fields": { "Name": "Mind" } },
          { "fields": { "Name": "Vitality" } },
          { "fields": { "Name": "Spell Speed" } },
          { "fields": { "Name": "" } },
          { "fields": { "Name": "" } },
          { "fields": { "Name": "" } }
        ]
      }
    },
    {
      "row_id": 1989,
      "fields": {
        "BaseParam": [
          { "fields": { "Name": "Mind" } },
          { "fields": { "Name": "Vitality" } },
          { "fields": { "Name": "Spell Speed" } },
          { "fields": { "Name": "" } },
          { "fields": { "Name": "" } },
          { "fields": { "Name": "" } }
        ],
        "Name": "Serpent Officer's Wand"
      },
      // ...
    },
  ]
}
```

</details>

To search for values in a language other than the request-wide `language`
parameter, fields may be decorated with a language.

<details>
<summary><code>query=Name@ja="天使の筆"</code></summary>

```json wrap "Name@ja=\"天使の筆\"" "Angel Brush"
// /api/search?sheets=Item&fields=Name&query=Name@ja="天使の筆"
{
  "results": [
    {
      "row_id": 42589,
      "fields": {
        "Name": "Angel Brush"
      }
    }
  ]
}
```

</details>

### Operations & Values

The examples above have been searching for fields using exact equality. To
tailor queries further, multiple operations are available that can perform
comparisons with type-aware semantics.

| Type | Example |
| --- | --- |
| String | `"value"` |
| Number | `1`, `-1`, `1.0` |
| Boolean | `true`, `false` |

| Operation | Type | Comparison |
| --- | --- | --- |
| `=` | any | Exact equality |
| `>=`, `>`, `<=`, `<` | number | Numeric comparison |
| `~` | string | Partial string comparison |

<details>
<summary><code>query=Name~"rainbow"</code></summary>

```json wrap "Name~\"rainbow\"" "Rainbow"
// /api/search?sheets=Action&fields=Name&query=Name~"rainbow"
{
  "results": [
    {
      "row_id": 34688,
      "fields": { "Name": "Rainbow Drip" }
    },
    {
      "row_id": 21474,
      "fields": { "Name": "Lunar Rainbow" }
    },
    {
      "row_id": 29388,
      "fields": { "Name": "Rainbow Gulal" }
    },
    {
      "row_id": 6288,
      "fields": {"Name": "Rainbow Dynamo" }
    }
  ]
}
```

</details>

<details>
<summary><code>query=Recast100ms>3000</code></summary>

```json wrap "Recast100ms>3000"
// /api/search?sheets=Action&fields=Name,Recast100ms&query=Recast100ms>3000
{
  "results": [
    {
      "row_id": 6,
      "fields": {
        "Name": "Return",
        "Recast100ms": 9000
      }
    },
    {
      "row_id": 30,
      "fields": {
        "Name": "Hallowed Ground",
        "Recast100ms": 4200
      }
    },
    // ...
  ]
}
```

</details>

### Multiple Clauses & Relevancy

One query may specify multiple clauses by seperating them with whitespace. All
results will match at least one of the provided clauses.

The ordering of results is defined by their relevance to the query - those that
match more clauses will be sorted before those that match less. The value used
for this ordering is returned in results as `score`.

<details>
<summary><code>query=ClassJobLevel=92 Name="Rainbow Drip"</code></summary>

In this example, all actions available at `ClassJobLevel` 92 are returned. As
rainbow drip also matches the `Name` clause, it is prioritised over the other
results.

```json wrap "ClassJobLevel=92 Name=\"Rainbow Drip\"" "92" "Rainbow Drip"
// /api/search?sheets=Action&fields=ClassJobLevel,Name&query=ClassJobLevel=92 Name="Rainbow Drip"
{
  "results": [
    {
      "score": 2,
      "row_id": 34688,
      "fields": {
        "ClassJobLevel": 92,
        "Name": "Rainbow Drip"
      }
    },
    {
      "score": 1,
      "row_id": 34644,
      "fields": {
        "ClassJobLevel": 92,
        "Name": "Uncoiled Twinfang"
      }
    },
    // ...
  ]
}
```

</details>

:::note

The manner in which scores are calculated is not considered part of the API
surface. Changes to the score calculation may be perfomed to improve result
relevance. Any such adjustments could lead to changes of score values and
resulting sort order of responses.

:::

### Filtering Results

By default, all query clauses **should** match, which leads to the relevance
sorting outlined above. This behavior can be adjusted with prefixes:

`+clause`
: Clause **must** match. Only matching results will be included in the response.

`-clause`
: Clause **must not** match. Any matching results will be discarded.

<details>
<summary><code>query=+ClassJobCategory.PCT=true +ClassJobLevel=92</code></summary>

This example searches for actions that must be usable by Pictomancers, and must
become available at level 92. Rainbow Drip is the only action that matches this
criteria.

```json wrap "+ClassJobCategory.PCT=true +ClassJobLevel=92" "Rainbow Drip"
// /api/search?sheets=Action&fields=Name&query=+ClassJobCategory.PCT=true +ClassJobLevel=92
{
  "results": [
    {
      "row_id": 34688,
      "fields": { "Name": "Rainbow Drip" }
    }
  ]
}
```

</details>

<details>
<summary><code>query=ClassJobCategory.WAR=true -ClassJobLevel&lt;96</code></summary>

This example searches for actions that should be usable by Warriors, and must
not become available before level 96.

```json wrap "ClassJobCategory.WAR=true -ClassJobLevel<96"
// /api/search?sheets=Action&fields=Name,ClassJobLevel&query=ClassJobCategory.WAR=true -ClassJobLevel<96
{
  "results": [
    {
      "row_id": 36924,
      "fields": {
        "ClassJobLevel": 96,
        "Name": "Primal Wrath"
      }
    },
    {
      "row_id": 36925,
      "fields": {
        "ClassJobLevel": 100,
        "Name": "Primal Ruination"
      }
    }
  ]
}
```

</details>

To perform more complex queries, clauses may be grouped with parentheses. In a
query, groups behave like a single clause, with an operation defined by the
sub-query inside.

For example, the simplified query `+a +(b c)` will return all results that match
both `a` and at least one of `b` or `c`.

<details>
<summary><code>query=+ClassJobCategory.PCT=true +(ClassJobLevel=80 ClassJobLevel=90)</code></summary>

This example searches for actions that are usable by a Pictomancer that _also_
become available at level 80 or 90.

```json wrap "+ClassJobCategory.PCT=true +(ClassJobLevel=80 ClassJobLevel=90)" "80" "90"
// /api/search?sheets=Action&fields=Name,ClassJobLevel&query=+ClassJobCategory.PCT=true +(ClassJobLevel=80 ClassJobLevel=90)
{
  "results": [
    {
      "score": 2,
      "row_id": 34662,
      "fields": {
        "ClassJobLevel": 80,
        "Name": "Holy in White"
      }
    },
    {
      "score": 2,
      "row_id": 34663,
      "fields": {
        "ClassJobLevel": 90,
        "Name": "Comet in Black"
      }
    }
  ]
}
```

</details>

:::caution[Query URI encoding]

It is important to ensure that queries have been encoded to a URI-safe string
when executing API requests, as characters such as `+` have alternate behavior
if left in plaintext.

Utilities for performing this encoding are available in most environments, i.e.
`encodeURIComponent` in JavaScript.

:::

## Querying Multiple Sheets

In addition to querying a single sheet as shown above, a query can be executed
across multiple sheets simultaneously. When doing so, results from all queried
sheets will be merged and sorted by their relevance.

<details>
<summary><code>sheets=Action,Item&query=Name~"rainbow"</code></summary>

This example searches for both actions _and_ items that contain "rainbow" in
their name.

```json wrap "sheets=Action,Item" "Action" "Item"
// /api/search?sheets=Action,Item&fields=Name&query=Name~"rainbow"
{
  "results": [
    {
      "sheet": "Item",
      "row_id": 28928,
      "fields": {
        "Name": "Fae Rainbow"
      }
    },
    {
      "sheet": "Action",
      "row_id": 34688,
      "fields": {
        "Name": "Rainbow Drip"
      }
    },
    // ...
  ]
}
```

</details>

When performing searches on multiple sheets, queries may only access the
_intersection_ of available fields. If fields are queried that are only present
on a subset of the specified sheets, query resolution will fail, and an error
will be returned.

## Pagination

The search endpoint accepts a `limit` parameter, with equivalent behavior to the
[parameter of the same name][sheets-multiple-rows] accepted by sheet endpoints.

If a response contains a subset of the full result set, a cursor value is
provided in the `next` property. Further results may be obtained by passing this
value to the `cursor` parameter in a new request. When querying with a cursor,
the `sheets` and `query` parameters are ignored, as the cursor is already
operating on a previous request's dataset.

[sheets-multiple-rows]: /docs/guides/sheets/#multiple-rows

<details>
<summary><code>query=Name~"rainbow"&limit=2</code></summary>

This is an example query from [Operations & Values] that returns 4 total
results, however the result limit has been set at 2 results. The first response
contains a cursor in `next`, and the second request uses this cursor to fetch
the remaining 2 results. No `next` is present on the second response, signalling
that no further results are present.

[Operations & Values]: #operations--values

```json wrap "limit=2" "4bce9ed3-74d7-4d4c-940f-4a918d204a58"
// /api/search?fields=Name&sheets=Action&query=Name~"rainbow"&limit=2
{
  "next": "4bce9ed3-74d7-4d4c-940f-4a918d204a58",
  "results": [
    {
      "row_id": 34688,
      "fields": { "Name": "Rainbow Drip" }
    },
    {
      "row_id": 21474,
      "fields": { "Name": "Lunar Rainbow" }
    }
  ]
}
// /api/search?fields=Name&cursor=4bce9ed3-74d7-4d4c-940f-4a918d204a58&limit=2
{
  "results": [
    {
      "row_id": 29388,
      "fields": { "Name": "Rainbow Gulal" }
    },
    {
      "row_id": 6288,
      "fields": { "Name": "Rainbow Dynamo" }
    }
  ]
}
```

</details>
