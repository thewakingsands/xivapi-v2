---
title: Reading Sheets
sidebar:
  order: 3
reference:
  href: /api/docs#tag/sheets
  description: OpenAPI specification for sheet endpoints.
---

Sheet endpoints retrieve data for one or more rows from a sheet, mapping values
to match a schema. Pinning is available for both game version and schema for
these endpoints, see [Ensuring Stability] for more information.

[Ensuring Stability]: /en/docs/guides/pinning/

## Language

Sheets with user-facing strings are commonly localised into all the languages
supported by the game client. For more details on localisations and game
editions, refer to [Important Concepts][concepts-localisations].

While XIVAPI defaults to English text in responses, other languages may be
requested with the `language` parameter.

```json /language=(ja|en|de|fr)/
// /api/sheet/Item/42589?fields=Name&language=ja
{ "fields": { "Name": "天使の筆" } }
// /api/sheet/Item/42589?fields=Name&language=en
{ "fields": { "Name": "Angel Brush" } }
// /api/sheet/Item/42589?fields=Name&language=de
{ "fields": { "Name": "Engelspinsel" } }
// /api/sheet/Item/42589?fields=Name&language=fr
{ "fields": { "Name": "Pinceau angélique" } }
```

[concepts-localisations]: /en/docs/guides/concepts/#editions--localisations

## Fields

Fields comprise the majority of the response for sheet endpoints. A number of
tools are available to filter and tune the way fields are represented in
responses.

### Types

All fields have a type derived from a combination of the game data and schema in
use. Types are used to define the overall structure of the data and how it is
read.

Scalar
: The most common field type, scalars represent a single value such as a number,
  string, or boolean.

Struct
: Sometimes, sheets contain a collection of related fields. Schemas may
  represent this as a struct, grouping the fields under a shared parent field in
  the response.

Array
: When consecutive fields represent a repetition of a value, schemas may group
  them into an array. Arrays always have a fixed length - unused entries are
  typically set to a null or zero value.

Additionally, scalars may have additional semantics supplied by their type:

Relationship
: Field with values that represent a link to another sheet. Refer to
  [field relationships] for further information.

Icon
: Numeric values representing an icon asset ID. XIVAPI will pre-compute the
  relevant paths for accessing the asset.

[field relationships]: /en/docs/guides/concepts#relationships

### Filtering

Sheets regularly contain more information than is needed for a single use-case.
This quickly compounds when field relationships are present that link in
additional rows of data. For example, the [full response][pct brush full] for
the "Angel Brush" `Item` is over 80kB before compression, representing
approximately 6500 lines of formatted JSON.

[pct brush full]: /api/sheet/Item/42589

To reduce the amount of unnecessary data in responses, the `fields` parameter
can be used to specify a subset of fields that should be included:

<details>
<summary><code>fields=Name,LevelEquip</code></summary>

```json "Name" "LevelEquip"
// /api/sheet/Item/42589?fields=Name,LevelEquip
{
  "fields": {
    "Name": "Angel Brush",
    "LevelEquip": 99
  }
}
```

</details>

If a field is nested within a struct or relationship, dot notation is used to
specify the path to access it:

<details>
<summary><code>fields=ItemUICategory.Name</code></summary>

```json "ItemUICategory.Name" "ItemUICategory" "Name"
// /api/sheet/Item/42589?fields=ItemUICategory.Name
{
  "fields": {
    "ItemUICategory": {
      "fields": {
        "Name": "Pictomancer's Arm"
      }
    }
  }
}
```

</details>

Array fields may be specified to retrieve values from all entries:

<details>
<summary><code>fields=BaseParam[].Name</code></summary>

```json "BaseParam[]" "BaseParam"
// /api/sheet/Item/42589?fields=BaseParam[].Name
{
  "fields": {
    "BaseParam": [
      { "fields": { "Name": "Intelligence" } },
      { "fields": { "Name": "Vitality" } }
      // ...
    ]
  }
}
```

</details>

:::tip[Not sure what field you want?]

You can omit the `fields` parameter on the `/sheet/{sheet}/{row}` endpoint to
see every field available for the given game version and schema. Fair warning,
there may be quite a few!

:::

### Decorators

In addition to filtering the fields in the response, the `fields` parameter can
also be used to specify "decorators" that modify how the field is read or
presented in responses. To avoid collisions, decorators are included in the
response field name.

#### `@lang(<lang>)`

While the `language` parameter can be used to change the default language used
in a request, it may be necessary to retrieve two or more languages in the same
request.

<details>
<summary><code>fields=Name,Name@lang(ja)</code></summary>

```json "Name@lang(ja)"
// /api/sheet/Item/42589?fields=Name,Name@lang(ja)
{
  "fields": {
    "Name": "Angel Brush",
    "Name@lang(ja)": "天使の筆"
  }
}
```

</details>

If specified on a structural field, the provided language will act as the
default for any nested fields:

<details>
<summary><code>fields=ItemUICategory@lang(de).Name</code></summary>

```json "ItemUICategory@lang(de)"
// /api/sheet/Item/42589?fields=ItemUICategory@lang(de).Name
{
  "fields": {
    "ItemUICategory@lang(de)": {
      "fields": {
        "Name": "Hauptwaffe der Piktomanten"
      }
    }
  }
}
```

</details>

#### `@as(<transform>)`

The `as` decorator performs transformations on fields to tailor the resulting
values for particular use cases.

`@as(raw)` will prevent processing of field types such as relationships and
icons, useful if the rich data is not going to be utilised.

<details>
<summary><code>fields=ItemUICategory,ItemUICategory@as(raw)</code></summary>

```json "ItemUICategory@as(raw)"
// /api/sheet/Item/42589?fields=ItemUICategory,ItemUICategory@as(raw)
{
  "fields": {
    "ItemUICategory": {
      "value": 111,
      // ...
      "fields": {
        // ...
      }
    },
    "ItemUICategory@as(raw)": 111
  }
}
```

</details>

`@as(html)` formats string values into HTML fragments, with support for most
text and formatting features in the game's rich text format.

<details>
<summary><code>fields=Description,Description@as(html)</code></summary>

```json wrap "Description@as(html)"
// /api/sheet/Item/44104?fields=Description,Description@as(html)
{
  "fields": {
    "Description": "Warm flour tortillas filled with slices of marinated rroneek chuck that has been grilled to a smoky char.\n\nEXP Bonus: +3% Duration: 30m\n(Duration can be extended to 60m by consuming multiple servings)",
    "Description@as(html)": "Warm flour tortillas filled with slices of marinated rroneek chuck that has been grilled to a smoky char.<br><br><span style=\"color:rgba(0,204,34,1);\">EXP Bonus:</span> +3% <span style=\"color:rgba(0,204,34,1);\">Duration:</span> 30m<br>(Duration can be extended to 60m by consuming multiple servings)"
  }
}
```

</details>

### Transient Sheets

As [outlined prior][transient sheets], related data may be split into two or
more sheets as an implementation detail. To reduce the number of requests needed
to retrieve data, the API attempts to find transient sheets, and includes their
content in a top-level `transient` key, when available.

To control these fields, the `transient` parameter can be provided. It accepts
identical syntax to the `fields` parameter [outlined above](#fields).

<details>
<summary><code>transient=Description@as(html)</code></summary>

```json wrap "transient"
// /api/sheet/Action/34684?transient=Description@as(html)
{
  "fields": {
    // ...
  },
  "transient": {
    "Description@as(html)": "Quickly dash 15 yalms forward.<br><span style=\"color:rgba(0,204,34,1);\">Additional Effect: </span>Increases movement speed<br><span style=\"color:rgba(0,204,34,1);\">Duration: </span>5s<br>Cannot be executed while bound."
  }
}
```

</details>

:::note

The check for transient sheets is naive - a request for the sheet `Example` will
blindly return data for matching rows in the `ExampleTransient` sheet, if it
exists.

While this approach works well for the majority of instances, always verify that
the data looks appropriate before committing to using transient values.

:::

[transient sheets]: /en/docs/guides/concepts/#transient-sheets

## Multiple Rows

All of the examples above have used the single-row endpoint,
`/api/sheet/{sheet}/{row}`. If more than one row from the same sheet is desired,
the row list endpoint is available.

All parameters outlined above are also available for the row list.

By default, it will list all rows in ID order, starting from the first.

```json
// /api/sheet/Item?fields=Name
{
  "rows": [
    { "row_id": 0, "fields": { "Name": "" } },
    { "row_id": 1, "fields": { "Name": "Gil" } },
    { "row_id": 2, "fields": { "Name": "Fire Shard" } },
    // ...
  ]
}
```

If provided, the `after` parameter will skip any rows less than or equal to the
specified row ID. Additionally, the `limit` parameter can be used to adjust the
maximum number of results returned in one response. Excessively large `limits`
will be clamped to a server-defined maximum.

<details>
<summary><code>after=1&limit=2</code></summary>

```json "after=1" "limit=2"
// /api/sheet/Item?fields=Name&after=1&limit=2
{
  "rows": [
    { "row_id": 2, "fields": { "Name": "Fire Shard" } },
    { "row_id": 3, "fields": { "Name": "Ice Shard" } }
  ]
}
```

</details>

Alternatively, a list of row IDs can be provided if already known - useful for
retrieving a batch of rows from a sheet.

<details>
<summary><code>rows=1,29,46</code></summary>

```json /(?:rows=|row_id": )(1)/ "29" "46"
// /api/sheet/Item?fields=Name&rows=1,29,46
{
  "rows": [
    { "row_id": 1, "fields": { "Name": "Gil" } },
    { "row_id": 29, "fields": { "Name": "MGP" } },
    { "row_id": 46, "fields": { "Name": "Allagan Tomestone of Aesthetics" } }
  ]
}
```

</details>

:::caution

Row IDs are **not** guaranteed to be contiguous, as many sheets contain
significant "holes" of unused IDs. In most cases, these IDs will not be present
in data, and will be skipped or ignored when requested, including when
iterating. 

:::
