#!/usr/bin/env node
// `@wdio/jasmine-framework` pulls in jasmine transitively.
import binProxy from './_proxy.js'

binProxy('jasmine', 'jasmine')
