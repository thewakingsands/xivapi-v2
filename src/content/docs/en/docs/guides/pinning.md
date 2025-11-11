---
title: Ensuring Stability
sidebar:
  order: 2
---

As outlined in important concepts, new [game versions][versions] may result in
arbitrary breaking changes, and [schemas] may receive changes from the community
to fix or improve them.

Either of the above may affect how the API structures data in responses - in
turn, breaking any code utilising the API that relies on that structure.

Nobody wants to be on the receiving end of unannounced breaking changes. XIVAPI
lets you "pin" game versions and schemas to ensure that your consumption of the
API won't change until you're ready to update it.

In addition, pins can be used to view data as it was in any prior game version
that has been recorded by the API.

[versions]: /en/docs/guides/concepts/#versions
[schemas]: /en/docs/guides/concepts/#schemas

## Game Versions

All API endpoints that serve data derived from game files accept a `version`
parameter. When specified, values in the response will represent how they were
at the version that was requested. If omitted, the version `latest` will be
used, which always retrieves data from the most recent game version available.

The full list of versions available for querying is available from the API,
refer to the [API reference][version-reference] for more details.

[version-reference]: /api/docs#tag/versions/GET/version

#### Example

In [FFXIV Patch 7.1][7-1-battle-system], a number of player actions were
updated, as is common in major patches. For the sake of this example, we're
looking at the Paladin action Cover, the range of which was increased by 10
yalms.

```json /version=7.[01]/ /"Range": ([12]0)/
// /api/sheet/Action/27?fields=Range&version=7.0
{ "fields": { "Range": 10 } }

// /api/sheet/Action/27?fields=Range&version=7.1
{ "fields": { "Range": 20 } }
```

[7-1-battle-system]: https://na.finalfantasyxiv.com/lodestone/topics/detail/9b42b2425f3a680caea3281ccd65c99677cb00e2/#random-507446d7e879c2a5e054cacddefcd58f77df3e3d

## Schemas

API endpoints that serve sheet data additionally accept a `schema` parameter.
The schema specified will be used when reading data from sheets, and to
interpret any field filters provided. If omitted, the most recent schema for the
requested game version will be used.

All requests that accept a schema parameter will also include a `schema` value
in the response object. The value is considered to be the _canonical_ specifier
for the schema that was used for the request - as such, it's recommended to take
note of the value, and use it if planning to pin the schema. Efforts are made to
ensure the canonical specifier is the most stable representation of the schema
at a point in time.

The API is built to support multiple community schema sources. At time of
writing, EXDSchema is the only actively supported source, see below for details
on its usage.

### EXDSchema

The [EXDSchema][exdschema] git repository tracks sheet schemas across game
versions, and is increasingly widely used throughout the FFXIV developer
community. XIVAPI offers a few approaches for specifying what EXDSchema mapping
you wish to use.

`exdschema@2:ver:request`
: Picks the most recent schema available for the game version the request targets.

`exdschema@2:rev:<revision>`
: Uses the schema as of the specified [git revision](https://git-scm.com/en/docs/revisions).

EXDSchema uses the `exdschema@2:rev:<revision>` form for canonical specifiers,
with the full SHA-1 object name for the resolved commit as the revision.

[exdschema]: https://github.com/xivdev/EXDSchema

#### Example

Among other changes, commit [`c44cfd2`][c44cfd2] renamed `WorldDCGroupType`'s
`Unknown0` field to `NeolobbyId`. A schema pin can be used to observe that
`c44cfd2` contains these changes, and that the parent commit `22f45f4` does not.

```json frame="none" /=(exdschema@2:rev:\w+)/ "\"NeolobbyId\"" "\"Unknown0\""
// /api/sheet/WorldDCGroupType/9? \
//   fields=Unknown0,NeolobbyId&schema=exdschema@2:rev:c44cfd2
{
  "schema": "exdschema@2:rev:c44cfd270a72248293e242b4950b2ddeff9e49f2",
  "fields": { "NeolobbyId": 9 }
}

// /api/sheet/WorldDCGroupType/9? \
//   fields=Unknown0,NeolobbyId&schema=exdschema@2:rev:22f45f4
{
  "schema": "exdschema@2:rev:22f45f4d6aab0c8722f5c0a6eabceb1e2a13c12c",
  "fields": { "Unknown0": 9 }
}
```

[c44cfd2]: https://github.com/xivdev/EXDSchema/commit/c44cfd270a72248293e242b4950b2ddeff9e49f2#diff-8d8a405e3d212bddee99cb53ef265fd0498a88df2027f3aa6fa41b1b7353bd7c
