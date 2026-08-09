# Class: SauceCommentReporter

Defined in: src/reporters/comment-reporter.js:147

## Extends

- `default`

## Constructors

### Constructor

```ts
new SauceCommentReporter(__namedParameters?): SauceCommentReporter;
```

Defined in: src/reporters/comment-reporter.js:148

#### Parameters

##### \_\_namedParameters?

###### debugMode?

`boolean` = `false`

###### logLevel?

`string` = `'info'`

###### maxTestNameCharacters?

`number` = `250`

###### mediaRenderTimeout?

`number` = `5`

###### onlyFailures?

`boolean` = `false`

###### outputDir?

`string` = `'_results_'`

###### recordAllActions?

`boolean` = `false`

###### sauceLabsSharableLinks?

`boolean` = `true`

###### saveAllTests?

`boolean` = `false`

###### videoSlowdownMultiplier?

`number` = `3`

#### Returns

`SauceCommentReporter`

#### Overrides

```ts
WDIOReporter.constructor
```

## Properties

### \_debugMode

```ts
_debugMode: boolean;
```

Defined in: src/reporters/comment-reporter.js:219

***

### \_excludedActions

```ts
_excludedActions: any[];
```

Defined in: src/reporters/comment-reporter.js:214

***

### \_frameNr

```ts
_frameNr: number;
```

Defined in: src/reporters/comment-reporter.js:227

***

### \_indents

```ts
_indents: number;
```

Defined in: src/reporters/comment-reporter.js:181

***

### \_logLevel

```ts
_logLevel: string;
```

Defined in: src/reporters/comment-reporter.js:220

***

### \_maxTestNameCharacters

```ts
_maxTestNameCharacters: number;
```

Defined in: src/reporters/comment-reporter.js:218

***

### \_mediaRenderTimeout

```ts
_mediaRenderTimeout: number;
```

Defined in: src/reporters/comment-reporter.js:213

***

### \_onlyFailures

```ts
_onlyFailures: boolean;
```

Defined in: src/reporters/comment-reporter.js:190

***

### \_orderedSuites

```ts
_orderedSuites: any[];
```

Defined in: src/reporters/comment-reporter.js:183

***

### \_outputDir

```ts
_outputDir: string;
```

Defined in: src/reporters/comment-reporter.js:199

***

### \_recordAllActions

```ts
_recordAllActions: boolean;
```

Defined in: src/reporters/comment-reporter.js:217

***

### \_recordingPath

```ts
_recordingPath: string;
```

Defined in: src/reporters/comment-reporter.js:303

***

### \_sauceLabsSharableLinks

```ts
_sauceLabsSharableLinks: boolean;
```

Defined in: src/reporters/comment-reporter.js:191

***

### \_saveAllTests

```ts
_saveAllTests: boolean;
```

Defined in: src/reporters/comment-reporter.js:211

***

### \_saveOutputToFile

```ts
_saveOutputToFile: any;
```

Defined in: src/reporters/comment-reporter.js:221

***

### \_screenshotBaseUrl

```ts
_screenshotBaseUrl: any;
```

Defined in: src/reporters/comment-reporter.js:192

***

### \_stateCounts

```ts
_stateCounts: object;
```

Defined in: src/reporters/comment-reporter.js:184

#### failed

```ts
failed: number = 0;
```

#### passed

```ts
passed: number = 0;
```

#### skipped

```ts
skipped: number = 0;
```

***

### \_suiteIndents

```ts
_suiteIndents: object;
```

Defined in: src/reporters/comment-reporter.js:182

***

### \_suiteUids

```ts
_suiteUids: Set<any>;
```

Defined in: src/reporters/comment-reporter.js:180

***

### \_testnameStructure

```ts
_testnameStructure: any[];
```

Defined in: src/reporters/comment-reporter.js:226

***

### \_videoSlowdownMultiplier

```ts
_videoSlowdownMultiplier: number;
```

Defined in: src/reporters/comment-reporter.js:212

***

### counts

```ts
counts: object;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:20

#### failures

```ts
failures: number;
```

#### hooks

```ts
hooks: number;
```

#### passes

```ts
passes: number;
```

#### pending

```ts
pending: number;
```

#### skipping

```ts
skipping: number;
```

#### suites

```ts
suites: number;
```

#### tests

```ts
tests: number;
```

#### Inherited from

```ts
WDIOReporter.counts
```

***

### currentSpec?

```ts
optional currentSpec?: string;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:33

#### Inherited from

```ts
WDIOReporter.currentSpec
```

***

### currentSuites

```ts
currentSuites: SuiteStats[];
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:19

#### Inherited from

```ts
WDIOReporter.currentSuites
```

***

### failures

```ts
failures: number;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:15

#### Inherited from

```ts
WDIOReporter.failures
```

***

### hooks

```ts
hooks: Record<string, HookStats>;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:17

#### Inherited from

```ts
WDIOReporter.hooks
```

***

### isContentPresent

```ts
isContentPresent: boolean;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:31

#### Inherited from

```ts
WDIOReporter.isContentPresent
```

***

### isDone

```ts
isDone: boolean;
```

Defined in: src/reporters/comment-reporter.js:195

***

### options

```ts
options: Partial<Reporters.Options>;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:13

#### Inherited from

```ts
WDIOReporter.options
```

***

### outputStream

```ts
outputStream: WriteStream | CustomWriteStream;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:14

#### Inherited from

```ts
WDIOReporter.outputStream
```

***

### retries

```ts
retries: number;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:29

#### Inherited from

```ts
WDIOReporter.retries
```

***

### runnerStat?

```ts
optional runnerStat?: RunnerStats;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:30

#### Inherited from

```ts
WDIOReporter.runnerStat
```

***

### screenshotPromises

```ts
screenshotPromises: any[];
```

Defined in: src/reporters/comment-reporter.js:224

***

### specs

```ts
specs: string[];
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:32

#### Inherited from

```ts
WDIOReporter.specs
```

***

### suites

```ts
suites: Record<string, SuiteStats>;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:16

#### Inherited from

```ts
WDIOReporter.suites
```

***

### tests

```ts
tests: Record<string, TestStats>;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:18

#### Inherited from

```ts
WDIOReporter.tests
```

***

### videoPromises

```ts
videoPromises: any[];
```

Defined in: src/reporters/comment-reporter.js:225

***

### reporterName

```ts
static reporterName: string;
```

Defined in: src/reporters/comment-reporter.js:855

## Accessors

### isSynchronised

#### Get Signature

```ts
get isSynchronised(): boolean;
```

Defined in: src/reporters/comment-reporter.js:231

allows reporter to stale process shutdown process until required sync work
is done (e.g. when having to send data to some server or any other async work)

##### Returns

`boolean`

#### Overrides

```ts
WDIOReporter.isSynchronised
```

## Methods

### \[captureRejectionSymbol\]()?

```ts
optional [captureRejectionSymbol](
   error, 
   event, ...
   args): void;
```

Defined in: node\_modules/@types/node/events.d.ts:87

The `Symbol.for('nodejs.rejection')` method is called in case a
promise rejection happens when emitting an event and
`captureRejections` is enabled on the emitter.
It is possible to use `events.captureRejectionSymbol` in
place of `Symbol.for('nodejs.rejection')`.

```js
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

#### Parameters

##### error

`Error`

##### event

`string` \| `symbol`

##### args

...`any`[]

#### Returns

`void`

#### Since

v13.4.0, v12.16.0

#### Inherited from

```ts
WDIOReporter.[captureRejectionSymbol]
```

***

### addListener()

```ts
addListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:92

Alias for `emitter.on(eventName, listener)`.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
WDIOReporter.addListener
```

***

### emit()

```ts
emit<E>(eventName, ...args): boolean;
```

Defined in: node\_modules/@types/node/events.d.ts:134

Synchronously calls each of the listeners registered for the event named
`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

##### args

...`any`[]

#### Returns

`boolean`

#### Since

v0.1.26

#### Inherited from

```ts
WDIOReporter.emit
```

***

### eventNames()

```ts
eventNames(): (string | symbol)[];
```

Defined in: node\_modules/@types/node/events.d.ts:154

Returns an array listing the events for which the emitter has registered
listeners.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

#### Since

v6.0.0

#### Inherited from

```ts
WDIOReporter.eventNames
```

***

### getCountDisplay()

```ts
getCountDisplay(duration): any[];
```

Defined in: src/reporters/comment-reporter.js:689

Get the display for passing, failing and skipped

#### Parameters

##### duration

`string`

Duration string

#### Returns

`any`[]

Count display

***

### getEnviromentCombo()

```ts
getEnviromentCombo(capability?): string;
```

Defined in: src/reporters/comment-reporter.js:811

Get information about the enviroment

#### Parameters

##### capability?

`any` = `{}`

enviroment details

#### Returns

`string`

Returns enviroment string

***

### getEventsToReport()

```ts
getEventsToReport(suite): any[];
```

Defined in: src/reporters/comment-reporter.js:629

Returns everything worth reporting from a suite

#### Parameters

##### suite

`any`

test suite containing tests and hooks

#### Returns

`any`[]

Returns list of Hook and Test events

***

### getFailureDisplay()

```ts
getFailureDisplay(): any[];
```

Defined in: src/reporters/comment-reporter.js:715

Get display for failed tests, e.g. stack trace

#### Returns

`any`[]

Stack trace output

***

### getHeaderDisplay()

```ts
getHeaderDisplay(envCombo, caps?): any[];
```

Defined in: src/reporters/comment-reporter.js:586

Get the header display for the report

#### Parameters

##### envCombo

`string`

runner environment combo

##### caps?

`any` = `{}`

runner capabilities

#### Returns

`any`[]

Returns header data

***

### getMaxListeners()

```ts
getMaxListeners(): number;
```

Defined in: node\_modules/@types/node/events.d.ts:161

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to
`events.defaultMaxListeners`.

#### Returns

`number`

#### Since

v1.0.0

#### Inherited from

```ts
WDIOReporter.getMaxListeners
```

***

### getOrderedSuites()

```ts
getOrderedSuites(): any[];
```

Defined in: src/reporters/comment-reporter.js:788

Get suites in the order they were called

#### Returns

`any`[]

Returns ordered suites

***

### getResultDisplay()

```ts
getResultDisplay(): any[];
```

Defined in: src/reporters/comment-reporter.js:643

Get the results from the tests

#### Returns

`any`[]

Returns display output list

***

### getTestLink()

```ts
getTestLink(__namedParameters?, useSauceLabsSharableLinks?): string[];
```

Defined in: src/reporters/comment-reporter.js:541

#### Parameters

##### \_\_namedParameters?

##### useSauceLabsSharableLinks?

`boolean` = `false`

#### Returns

`string`[]

***

### listenerCount()

```ts
listenerCount<E>(eventName, listener?): number;
```

Defined in: node\_modules/@types/node/events.d.ts:170

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

The name of the event being listened for

##### listener?

(...`args`) => `void`

The event handler function

#### Returns

`number`

#### Since

v3.2.0

#### Inherited from

```ts
WDIOReporter.listenerCount
```

***

### listeners()

```ts
listeners<E>(eventName): (...args) => void[];
```

Defined in: node\_modules/@types/node/events.d.ts:186

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

#### Returns

(...`args`) => `void`[]

#### Since

v0.1.26

#### Inherited from

```ts
WDIOReporter.listeners
```

***

### off()

```ts
off<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:191

Alias for `emitter.removeListener()`.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Since

v10.0.0

#### Inherited from

```ts
WDIOReporter.off
```

***

### on()

```ts
on<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:225

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

The name of the event.

##### listener

(...`args`) => `void`

The callback function

#### Returns

`this`

#### Since

v0.1.101

#### Inherited from

```ts
WDIOReporter.on
```

***

### onAfterAssertion()

```ts
onAfterAssertion(_assertionArgs): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:48

#### Parameters

##### \_assertionArgs

`unknown`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onAfterAssertion
```

***

### onAfterCommand()

```ts
onAfterCommand(jsonWireMsg): void;
```

Defined in: src/reporters/comment-reporter.js:236

#### Parameters

##### jsonWireMsg

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onAfterCommand
```

***

### onBeforeAssertion()

```ts
onBeforeAssertion(_assertionArgs): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:47

#### Parameters

##### \_assertionArgs

`unknown`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onBeforeAssertion
```

***

### onBeforeCommand()

```ts
onBeforeCommand(_commandArgs): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:45

#### Parameters

##### \_commandArgs

`BeforeCommandArgs`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onBeforeCommand
```

***

### once()

```ts
once<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:256

Adds a **one-time** `listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

The name of the event.

##### listener

(...`args`) => `void`

The callback function

#### Returns

`this`

#### Since

v0.3.0

#### Inherited from

```ts
WDIOReporter.once
```

***

### onHookEnd()

```ts
onHookEnd(hook): void;
```

Defined in: src/reporters/comment-reporter.js:271

#### Parameters

##### hook

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onHookEnd
```

***

### onHookStart()

```ts
onHookStart(_hookStat): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:50

#### Parameters

##### \_hookStat

`HookStats`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onHookStart
```

***

### onRunnerEnd()

```ts
onRunnerEnd(runner): void;
```

Defined in: src/reporters/comment-reporter.js:450

#### Parameters

##### runner

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onRunnerEnd
```

***

### onRunnerStart()

```ts
onRunnerStart(runner): void;
```

Defined in: src/reporters/comment-reporter.js:445

#### Parameters

##### runner

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onRunnerStart
```

***

### onSuiteEnd()

```ts
onSuiteEnd(): void;
```

Defined in: src/reporters/comment-reporter.js:287

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onSuiteEnd
```

***

### onSuiteRetry()

```ts
onSuiteRetry(_suiteStats): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:59

#### Parameters

##### \_suiteStats

`SuiteStats`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onSuiteRetry
```

***

### onSuiteStart()

```ts
onSuiteStart(suite): void;
```

Defined in: src/reporters/comment-reporter.js:279

#### Parameters

##### suite

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onSuiteStart
```

***

### onTestEnd()

```ts
onTestEnd(test): void;
```

Defined in: src/reporters/comment-reporter.js:393

#### Parameters

##### test

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onTestEnd
```

***

### onTestFail()

```ts
onTestFail(test): void;
```

Defined in: src/reporters/comment-reporter.js:311

#### Parameters

##### test

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onTestFail
```

***

### onTestPass()

```ts
onTestPass(test): void;
```

Defined in: src/reporters/comment-reporter.js:307

#### Parameters

##### test

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onTestPass
```

***

### onTestPending()

```ts
onTestPending(_testStats): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:57

#### Parameters

##### \_testStats

`TestStats`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onTestPending
```

***

### onTestRetry()

```ts
onTestRetry(_testStats): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:55

#### Parameters

##### \_testStats

`TestStats`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.onTestRetry
```

***

### onTestSkip()

```ts
onTestSkip(test): void;
```

Defined in: src/reporters/comment-reporter.js:384

#### Parameters

##### test

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onTestSkip
```

***

### onTestStart()

```ts
onTestStart(test): void;
```

Defined in: src/reporters/comment-reporter.js:296

#### Parameters

##### test

`any`

#### Returns

`void`

#### Overrides

```ts
WDIOReporter.onTestStart
```

***

### prependListener()

```ts
prependListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:275

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

The name of the event.

##### listener

(...`args`) => `void`

The callback function

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

```ts
WDIOReporter.prependListener
```

***

### prependOnceListener()

```ts
prependOnceListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:292

Adds a **one-time** `listener` function for the event named `eventName` to the
_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

The name of the event.

##### listener

(...`args`) => `void`

The callback function

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

```ts
WDIOReporter.prependOnceListener
```

***

### printReport()

```ts
printReport(runner): Promise<any>;
```

Defined in: src/reporters/comment-reporter.js:491

#### Parameters

##### runner

`any`

#### Returns

`Promise`\<`any`\>

***

### rawListeners()

```ts
rawListeners<E>(eventName): (...args) => void[];
```

Defined in: node\_modules/@types/node/events.d.ts:326

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

#### Returns

(...`args`) => `void`[]

#### Since

v9.4.0

#### Inherited from

```ts
WDIOReporter.rawListeners
```

***

### removeAllListeners()

```ts
removeAllListeners<E>(eventName?): this;
```

Defined in: node\_modules/@types/node/events.d.ts:338

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName?

`string` \| `symbol`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
WDIOReporter.removeAllListeners
```

***

### removeListener()

```ts
removeListener<E>(eventName, listener): this;
```

Defined in: node\_modules/@types/node/events.d.ts:425

Removes the specified `listener` from the listener array for the event named
`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any
`removeListener()` or `removeAllListeners()` calls _after_ emitting and
_before_ the last listener finishes execution will not remove them from
`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indexes of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`
listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

##### E

`E` *extends* `string` \| `symbol`

#### Parameters

##### eventName

`string` \| `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

```ts
WDIOReporter.removeListener
```

***

### setMaxListeners()

```ts
setMaxListeners(n): this;
```

Defined in: node\_modules/@types/node/events.d.ts:436

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to
`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

##### n

`number`

#### Returns

`this`

#### Since

v0.3.5

#### Inherited from

```ts
WDIOReporter.setMaxListeners
```

***

### write()

```ts
write(content): void;
```

Defined in: node\_modules/@wdio/reporter/build/index.d.ts:43

function to write to reporters output stream

#### Parameters

##### content

`unknown`

#### Returns

`void`

#### Inherited from

```ts
WDIOReporter.write
```
