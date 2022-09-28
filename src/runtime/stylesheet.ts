import { computed, watch } from 'vue'
import type { TokensFunction } from '../types'
import { resolveCssProperty, stringify, transformVariantsAndPropsToDeclaration } from './utils'

export function usePinceauStylesheet(state: any, $tokens: TokensFunction) {
  const declaration = computed(() => transformVariantsAndPropsToDeclaration(state.variantsState, state.propsState))

  const getStylesheetContent = () => stringify(declaration.value, (property: any, value: any, style: any, selectors: any) => resolveCssProperty(property, value, style, selectors, $tokens))

  const updateStylesheet = () => {
    // Only update stylesheet on client-side
    // SSR Rendering occurs in `app:rendered` hook, or via `getStylesheetContent`
    if (!import.meta.env.SSR && document) {
      const content = getStylesheetContent()
      let style = document.querySelector('style#pinceau')

      if (!style) {
        const styleTag = document.createElement('style')
        styleTag.id = 'pinceau'
        document.head.prepend(styleTag)
        style = styleTag
      }

      style.textContent = content
    }
  }

  watch(declaration, () => updateStylesheet())

  return {
    updateStylesheet,
    getStylesheetContent,
  }
}
