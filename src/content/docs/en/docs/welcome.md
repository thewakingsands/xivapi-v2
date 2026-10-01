---
title: Welcome
description: An introduction to XIVAPI and its features.
---

XIVAPI is a comprehensive and modern web API for Final Fantasy XIV (FFXIV) game
data. From action tooltips to entire database applications and everything in
between, XIVAPI provides a powerful and reliable data source with the
information you need.

This service is a partial compatibility implementation of 
[XIVAPI](https://v2.xivapi.com). Please read 
[Differences from the Official Version](/en/docs/guides/difference/) before 
using it. If you encounter any issues with this service, please 
[create an issue](https://github.com/thewakingsands/xivapi-v2/issues/new). For 
questions about the official XIVAPI version, you can join the 
[Discord server](https://discord.gg/MFFVHWC).

## Features

This service provides access to published FFXIV sheet data, icons and maps over
HTTP. It does not expose every game file; see [service limitations](/en/docs/guides/difference/).

Highlights include:

- **[Schema Pinning](/en/docs/guides/pinning/):** Pin field names and mappings to
  a schema revision. Sheet data always uses the latest local release, so a
  schema pin does not freeze the underlying game data.
- **[Full-dataset search](/en/docs/guides/search/):** Any field can be used in
  search queries and filters to help find what you're looking for - even if
  nobody knows what it means!
- **[Built in the open](/en/docs/software/):** The API, its dependencies, and much
  of the FFXIV developer ecosystem is proudly open source. See how it all ticks,
  or jump in and lend a hand!

## What It Isn't

The API can _only_ provide data that is found in the game's client files. It has
no access to server-side information such as players or free companies, nor
runtime information such as inventory or equipment.

If you wish to access this data, you can find alternatives on [the software page](/en/docs/software/#alternatives).
