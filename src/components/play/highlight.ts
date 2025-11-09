import shikiThemeCatppuccinLatte from '@shikijs/themes/catppuccin-latte'
import shikiThemeCatppuccinMocha from '@shikijs/themes/catppuccin-mocha'
import shikiLangJson from '@shikijs/langs/json'
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import shikiHighlighter from 'shiki/wasm'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import * as jsxRuntime from 'preact/jsx-runtime';

export async function highlight(code: string) {
  const highlighter = await buildHighlighter()
  const out = await highlighter.codeToHast(code, {
    lang: 'json',
    defaultColor: false,
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha'
    },
    colorReplacements: {
      // Remove backgrounds
      'catppuccin-latte': { '#eff1f5': 'transparent' },
      'catppuccin-mocha': { '#1e1e2e': 'transparent' },
    }
  })
  return toJsxRuntime(out, jsxRuntime)
}

let highlighter: HighlighterCore | undefined
async function buildHighlighter() {
  if (highlighter != null) {
    return highlighter
  }

  highlighter = await createHighlighterCore({
    themes: [
      shikiThemeCatppuccinLatte,
      shikiThemeCatppuccinMocha,
    ],
    langs: [
      shikiLangJson,
    ],
    engine: createOnigurumaEngine(shikiHighlighter)
  })

  return highlighter
}
