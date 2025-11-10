---
title: Important Concepts
description: Structures, terms, and ideas that underpin XIVAPI's functionality.
sidebar:
  order: 1
prev: false
---

There are concepts and usages of terminology that take on particular meaning
within the context of FFXIV development. While XIVAPI abstracts most of these
details, a few specific concepts are essential to understand to make effective
use of its features, detailed below.

## Versions

As a live service MMO, FFXIV receives "patches" and "hotfixes" regularly. These
frequently involve updates to the game client's files. The content of the game
files after one of these updates is considered a **version**, and is typically
named after the patch that introduced the changes. Between updates, the game
files are completely static - they are never updated or modified during
gameplay.

While loose correlations may be drawn, it is best practice to consider that
_any_ update may result in _any_ change to client files. As such, a change of
game version should be considered a "major" update in [semver] terms.

[semver]: https://semver.org/

## Sheets

Like many applications, FFXIV stores a significant amount of its content and
data in a relational database. A sizeable portion of this data is included in
the game client files in a propriatary file format referred to as excel (no,
not the Microsoft product), or exd.

While similarities may be drawn between excel and traditional RDBMS, it is not a
perfect 1:1 mapping. Excel is specialised for its usage as static data in FFXIV,
and features non-standard functionality as a result.

Within excel, a single collection of data is known as a **sheet**, analogous
to a table within a database.

### Fields

Keeping with the database analogy, sheets contain one or more columns, or
**fields**. Each field has a data type (string, number, boolean, and so forth)
which is consistent for all values for that field.

But that's about as far as the analogy will get us. In addition to the basic
("scalar") data types, fields are frequently grouped into collections such as
fixed-size arrays and structs, which exist within individual rows of the sheet.

### Relationships

Every sheet has a built-in ID field, the row ID, which acts as the sheet's
primary key. Some specialised sheets will additionally contain a _subrow_ ID.
When present, the combination of row and subrow ID acts as a composite primary
key.

Sheets will regularly contain fields that act akin to foreign keys, referencing
rows in other sheets by their ID. These links are known as **relationships**. In
many cases, the target sheet of these relationships can be one of multiple
distinct sheets - the manner in which the target sheet is chosen varies
field-to-field, and is ultimately decided by game logic outside the dataset
entirely.

### Editions & Localisations

FFXIV is officially localised into Japanese, English, German, and French. These
localisations all use the same "global" game client, containing content prepared
for all 4 locales.

In addition to the above, seperate Chinese and Korean game clients are
available, each providing a localisation into their respective language. These
clients follow different versioning to the global client, and usually contain
slightly outdated content.

:::note[Limitations of XIVAPI locale support]

At time of writing, XIVAPI only provides data available in the global game
client: Japanese, English, German, and French. Alternatives may be available for
other game editions - If you operate an API-compatible service, please contact
us so we can direct consumers looking for this data to you!

:::

### Transient Sheets

In some instances, sheets may contain a mix of both data that needs to be
readily available and frequently used, and data that is infrequently accessed
and/or is slow to load. To handle this, sheets are occasionally split into two
or more seperate sheets along that access-requirement line, with all sheets
sharing their row IDs.

By convention, _most_ of these splits result in the infrequent-access data being
moved to a sheet with the `Transient` suffix.

For example, the `Action` sheet contains data about both player and enemy
actions. While most of this data is frequently used throughout the game to
display details about actions, the description of an action is only ever shown
in mouse-over tooltips. As such, the description is stored in the
`ActionTransient` sheet, rather than `Action` itself. Data for the White Mage
action "Cure" can be found at row ID `120` on both sheets.


## Schemas

The game files contain minimal information about how sheets are structured. For
any sheet; only its name, supported languages, the number of fields, and those
field's types are available.

To flesh out this information, **schemas** are available, providing names and
structure to the fields in each sheet. These schemas are a community effort, and
are not perfectly comprehensive or accurate.

Schemas that are used by XIVAPI are listed on the [software] page.

[software]: /docs/software/
