// vitest setup (replaces jest.setup.js)
//
// Capability/config builders read process.env indirectly in a few places
// (`src/services/base.js` reads `process.env.DEBUG`), so keep the test process
// deterministic regardless of the developer's shell.
process.env.NODE_ENV = 'test'
delete process.env.DEBUG
