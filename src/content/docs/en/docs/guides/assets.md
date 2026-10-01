---
title: Retrieving Assets
sidebar:
  order: 5
reference:
  href: /api/docs#tag/assets
  description: OpenAPI specification for asset endpoints.
---

Asset endpoints return image bytes, not JSON.

## Limitations

This service currently supports **icons (`ui/icon/`) and maps (`ui/map/`) only**. Other game assets, including loading screens, UI textures outside these directories, models and audio, are not supported. A valid game path alone does not guarantee availability: the file must also be present in the published asset index. Missing assets return `404`.

For `/api/asset?path=...` and `/api/asset/<game-path>`, `format` is optional. When omitted, the stored image is returned unchanged, normally as WebP or AVIF. Use the response's `Content-Type` to identify its format; the game path's `.tex` extension does not determine the response encoding.

Specify `format=png`, `format=jpg` or `format=webp` to request that encoding. `format=avif` only returns an existing AVIF image unchanged; a non-AVIF source returns `400` because AVIF encoding is not supported. The service does not negotiate formats using the `Accept` header.

Assets use their own published snapshots, independently of sheet data. Omitting `version`, or using `version=latest`, selects the asset snapshot loaded by the service. An explicit game version is available only if its asset index has been published; upstream version hashes and GitHub release titles are not supported. A schema pin is not needed.

## A Word on Caching

You can use asset URLs directly in image elements. Clients should respect `Cache-Control` and retain `ETag` values. Sending a matching `If-None-Match` allows the server to respond with `304 Not Modified` instead of transferring the image again. Browsers normally handle this automatically.

## Fetch Assets

Provide the original game path, optionally specifying an output format:

```text
/api/asset?path=ui/icon/051000/051474_hr1.tex
/api/asset?path=ui/icon/051000/051474_hr1.tex&format=png
/api/asset/ui/icon/051000/051474_hr1.tex?format=png
```

[Open the example icon](https://xivapi-v2.xivcdn.com/api/asset?path=ui/icon/051000/051474_hr1.tex&format=png).

Icon fields in [sheet responses](/en/docs/guides/sheets/) include game paths. Use those paths, including any language directory or `_hr1` suffix, rather than a MinIO object name. Map source textures can also be requested this way, but use the map endpoint below when you need a composed map.

## Compose Maps

The map endpoint combines the main map texture with its background when required, and also handles precomposed maps:

```text
/api/asset/map/s1d1/00
/api/asset/map/s1d1/00?format=png
```

[Open the example map](https://xivapi-v2.xivcdn.com/api/asset/map/s1d1/00?format=png).

The two path segments come from the `Map` sheet's `Id` value, such as `s1d1/00`. Unlike file retrieval, this endpoint defaults to `jpg`; `format=png` and `format=webp` are also supported. `format=avif` returns `400` because this endpoint composes images rather than returning a stored object.

To retrieve a map source texture unchanged, use `/api/asset?path=ui/map/s1d1/00/s1d100_m.tex` without `format`.

## Legacy V1 Paths

FFCafe additionally preserves the V1 icon paths at the site root, **not** under `/api`:

```text
/i/051000/051474.png
/i/051000/051474_hr1.png
```

[Open the V1-compatible icon](https://xivapi-v2.xivcdn.com/i/051000/051474_hr1.png).

Both directory and icon ID are six-digit, zero-padded numbers. The conventional directory is the icon ID rounded down to a multiple of 1,000; lookup uses the icon ID even if a different six-digit directory is supplied. `_hr1` requests the high-resolution variant. This compatibility route serves default-variant icons, not maps or language-specific icon paths.

The `.png` suffix is retained for URL compatibility: the response contains the stored WebP or AVIF image, identified by its `Content-Type`. Neither the suffix, a `format` query parameter nor the `Accept` header selects a conversion on this route. If an application needs actual PNG bytes, use `/api/asset?...&format=png` instead.
