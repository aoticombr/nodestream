import { it, describe, beforeEach, afterEach, after } from 'node:test'
import assert from 'node:assert'
import { getTestServer, pipeAndReadStreamData, commandSender } from './helpers.js'
import { setTimeout } from 'node:timers/promises'
const RETENTION_PERIOD = 100
const possibleCommands = {
    applause: 'applause',
    audience: 'audience',
    boo: 'boo',
    fart: 'fart',
    laugh: 'laugh',
    start: 'start',
    stop: 'stop',
}


describe('API E2E Test Suite', () => {

    describe('client workflow', () => {
        let _server;
        beforeEach(async () => {
            _server = await getTestServer()
        })
        afterEach(async () => {
            await _server.killServer()
        })

        // NOTE: if you dont wanna remember to always send stop command
        // you can manually destroy the child process after the test ended

        // after(() => {
        //     const handles = process._getActiveHandles()
        //     // remove all handlers for child process
        //     for (const handle of handles) {
        //         if (!handle.stdin) continue

        //         handle.stdin.destroy()
        //         handle.stderr.destroy()
        //         handle.stdout.destroy()
        //     }
        // })

        it('should not receive data stream if the process is not playing', async (context) => {
            const { url } = _server
            const onChunk = context.mock.fn()
            await pipeAndReadStreamData(url, onChunk, RETENTION_PERIOD)

            assert.strictEqual(
                onChunk.mock.callCount(), 0,
                `Expect onChunk to not have been called, but got ${onChunk.mock.callCount()}`
            )
        })


        it('sending all commands at once together should not break the API', async (context) => {
            const { url } = _server
            const { send } = commandSender(url)
            await send(possibleCommands.start)

            const onChunk = context.mock.fn()
            const commands = Reflect.ownKeys(possibleCommands).filter(
                (cmd) => cmd !== possibleCommands.start && cmd !== possibleCommands.stop
            )
            const maxTimeout = RETENTION_PERIOD * commands.length
            const response = pipeAndReadStreamData(
                url,
                onChunk,
                maxTimeout
            )

            const requests = commands.map((command) => send(command))
            await Promise.all(requests)

            await setTimeout(RETENTION_PERIOD)
            await send(possibleCommands.stop)
            await response;

            const atLeastCallCount = 1

            assert(
                onChunk.mock.callCount() >= atLeastCallCount,
                `Expected onChunk.mock.calls.length to be greater or equal than ${atLeastCallCount}, but got ${onChunk.mock.calls.length}`
            )

            const byteLength = onChunk.mock.calls[1].arguments[0].byteLength
            assert(byteLength >= 1600, `Expected byteLength to be greater than 1600, but got ${byteLength}`)

        })

        it("it should not break sending commands to the API if there's no audio playing", async (context) => {
            const { url } = _server
            const { send } = commandSender(url)
            const onChunk = context.mock.fn()
            const response = pipeAndReadStreamData(url, onChunk, RETENTION_PERIOD)
            await send(possibleCommands.applause)


            await response
            assert.strictEqual(onChunk.mock.callCount(), 0,
                `Expected onChunk.mock.calls.length to be 0, but got ${onChunk.mock.callCount()}`
            )
        })
    })
})