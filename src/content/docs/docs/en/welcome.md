---
title: Welcome
description: An introduction to XIVAPI and its features.
---

XIVAPI is a comprehensive and modern web API for Final Fantasy XIV (FFXIV) game
data. From action tooltips to entire database applications and everything in
between, XIVAPI provides a powerful and reliable data source with the
information you need.

If you have any questions not covered in the documentation, or intend to use
XIVAPI in a production environment, it's recommended you join
[the Discord server](https://discord.gg/MFFVHWC). Maintainers and frequent users
of the API are regularly around to help, and any live service announcements will
be posted there first.

## Features

XIVAPI offers access to FFXIV data from anywhere with an internet connection.
Every sheet, texture, and value - if it's part of the game client, we've got it.

Highlights include:
- **[API Stability](/en/docs/guides/pinning/):** You can't decide when a patch
  releases, but you _can_ decide when it impacts you. Pin requests to ensure
  consistency until you're ready to update your code.
- **[Full-dataset search](/en/docs/guides/search/):** Any field can be used in
  search queries and filters to help find what you're looking for - even if
  nobody knows what it means!
  friendly formats, no further processing required.
- **[Built in the open](/en/docs/software/):** The API, its dependencies, and much
  of the FFXIV developer ecosystem is proudly open source. See how it all ticks,
  or jump in and lend a hand!

## What It Isn't

The API can _only_ provide data that is found in the game's client files. It has
no access to server-side information such as players or free companies, nor
runtime information such as inventory or equipment.

If you're looking for runtime data, there are a few adjacent projects that may
offer what you need listed on [the software page](/en/docs/software/#alternatives).
