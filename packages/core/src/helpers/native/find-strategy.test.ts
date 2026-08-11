import { describe, it, expect } from 'vitest'

import { defineStrategy, findStrategy } from './find-strategy'

describe('defineStrategy', () => {
  it('returns "directly" for a selector with an explicit strategy prefix', () => {
    expect(defineStrategy('id:foo')).toBe('directly')
  })

  it('returns "xpath" for a selector starting with /', () => {
    expect(defineStrategy('//div')).toBe('xpath')
  })

  it('returns "link text" for a selector starting with =', () => {
    expect(defineStrategy('=Click me')).toBe('link text')
  })

  it('returns "partial link text" for a selector starting with *=', () => {
    expect(defineStrategy('*=Click')).toBe('partial link text')
  })

  it('returns "id" for a selector starting with id=', () => {
    expect(defineStrategy('id=foo')).toBe('id')
  })

  it('returns "shadow" for a selector starting with >>>', () => {
    expect(defineStrategy('>>>shadow-root')).toBe('shadow')
  })

  it('returns "-android uiautomator" for a selector starting with android=', () => {
    expect(defineStrategy('android=new UiSelector()')).toBe('-android uiautomator')
  })

  it('returns "-ios uiautomation" for a selector starting with ios=', () => {
    expect(defineStrategy('ios=.elements()')).toBe('-ios uiautomation')
  })

  it('returns "accessibility id" for a selector starting with ~', () => {
    expect(defineStrategy('~submit')).toBe('accessibility id')
  })

  it('returns "class name" for an XCUIElementType-style selector', () => {
    expect(defineStrategy('XCUIElementTypeButton')).toBe('class name')
  })

  it('returns "tag name" for an HTML-tag-shaped selector', () => {
    expect(defineStrategy('<div>')).toBe('tag name')
  })

  it('returns "name" for a [name=...] selector', () => {
    expect(defineStrategy('[name="foo"]')).toBe('name')
  })

  it('returns "xpath" for "." (current element)', () => {
    expect(defineStrategy('.')).toBe('xpath')
  })

  it('returns "role" for a [role=...] selector', () => {
    expect(defineStrategy('[role=button]')).toBe('role')
  })

  it('returns "default" for a plain selector', () => {
    expect(defineStrategy('foo')).toBe('default')
  })
})

describe('findStrategy', () => {
  it('parses a direct strategy selector into { using, value }', () => {
    expect(findStrategy('id:foo')).toEqual({ using: 'id', value: 'foo' })
  })

  it('treats a default selector as an id lookup', () => {
    expect(findStrategy('foo')).toEqual({ using: 'id', value: 'foo' })
  })

  it('strips the id= prefix for an id selector', () => {
    expect(findStrategy('id=foo')).toEqual({ using: 'id', value: 'foo' })
  })

  it('passes an xpath selector through unchanged', () => {
    expect(findStrategy('//div')).toEqual({ using: 'xpath', value: '//div' })
  })

  it('strips the = prefix for a link text selector', () => {
    expect(findStrategy('=Click me')).toEqual({ using: 'link text', value: 'Click me' })
  })

  it('strips the *= prefix for a partial link text selector', () => {
    expect(findStrategy('*=Click')).toEqual({ using: 'partial link text', value: 'Click' })
  })

  it('strips the >>> prefix for a shadow selector', () => {
    expect(findStrategy('>>>root')).toEqual({ using: 'shadow', value: 'root' })
  })

  it('strips the android= prefix for a -android uiautomator selector', () => {
    expect(findStrategy('android=UiSelector')).toEqual({ using: '-android uiautomator', value: 'UiSelector' })
  })

  it('strips the ios= prefix for a -ios uiautomation selector', () => {
    expect(findStrategy('ios=.elements()')).toEqual({ using: '-ios uiautomation', value: '.elements()' })
  })

  it('strips the ~ prefix for an accessibility id selector', () => {
    expect(findStrategy('~submit')).toEqual({ using: 'accessibility id', value: 'submit' })
  })

  it('resolves a class name selector', () => {
    expect(findStrategy('XCUIElementTypeButton')).toEqual({ using: 'class name', value: 'XCUIElementTypeButton' })
  })

  it('strips angle brackets/slashes for a tag name selector', () => {
    expect(findStrategy('<div />')).toEqual({ using: 'tag name', value: 'div' })
  })

  it('extracts the attribute value for a name selector', () => {
    expect(findStrategy('[name="foo"]')).toEqual({ using: 'name', value: 'foo' })
  })

  it('resolves an extended xpath selector with a class prefix', () => {
    const result = findStrategy('.header=Welcome')
    expect(result.using).toBe('xpath')
    expect(result.value).toContain('contains(@class, "header")')
  })

  it('resolves a role selector into a css selector xpath lookup', () => {
    const result = findStrategy('[role=button]')
    expect(result.using).toBe('css selector')
    expect(typeof result.value).toBe('string')
    expect(result.value).toContain('[role="button"]')
  })
})
