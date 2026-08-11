/**
 * `aria-query` ships no type declarations and has no `@types` package.
 * Minimal shim covering only what `find-strategy.ts` uses: `roleElements`,
 * a lookup from ARIA role name to the DOM element shapes that satisfy it.
 */
declare module 'aria-query' {
  export interface AriaQueryElementAttribute {
    name: string
    value?: string
  }

  export interface AriaQueryElement {
    name: string
    attributes?: AriaQueryElementAttribute[]
  }

  export const roleElements: Map<string, AriaQueryElement[]>
}
