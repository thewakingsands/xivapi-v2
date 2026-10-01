# XIVAPI static pages

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## Environment

Use Node.js 22.12.0 or newer and pnpm 11.6.0, as declared in `package.json`.
The publishing workflow uses Node.js 24 and installs the declared pnpm version.
Build permissions and the Starlight sidebar patch are configured in
`pnpm-workspace.yaml`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |
