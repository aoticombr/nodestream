const buffer = Buffer.alloc(5)
buffer.fill('hi',0,2)
buffer.fill(0x3a,2,3) //hexadecimal char code for ':'
buffer.fill(0x29,3,4) //hexadecimal char code for ')'
//error: buffer
//buffer.fill('!',5,6)
//console.log(buffer.toString()) // hi:)

const anotherBuffer = Buffer.alloc(6)
anotherBuffer.set(buffer,buffer.byteOffset)
anotherBuffer.fill('four',5,6)
console.log(buffer.toString(), buffer, buffer.byteLength) // hi:)
console.log(anotherBuffer.toString(), anotherBuffer, anotherBuffer.byteLength) // hi:)


// Path: 02-buffer.mjs
const msg = 'Hey there!'
const preAllocated = Buffer.alloc(msg.length, msg)
const withBufferFrom = Buffer.from(msg)
console.log(preAllocated.toString(),preAllocated,preAllocated.byteLength) // Hey there!
console.log(withBufferFrom.toString(),withBufferFrom,withBufferFrom.byteLength) // Hey there!

const str = 'Hello there!'
const charCodes = []
const byte = []
for (const index in str) {
    //integers / decimal char codes
  const code_int = str.charCodeAt(index)
  const code_char = str.charAt(index)
  const code_hex = code_int.toString(16)
  const code_byte = '0x' + Math.abs(code_int).toString(16)
  charCodes.push(code_int)
  byte.push(code_byte)

  console.log({code_int, code_char, code_hex, code_byte})
}
console.log({
    charCodes,
    byte,
    contentFromCharCodes: Buffer.from(charCodes).toString(),
    contentFromHexaBytes: Buffer.from(byte).toString()
})