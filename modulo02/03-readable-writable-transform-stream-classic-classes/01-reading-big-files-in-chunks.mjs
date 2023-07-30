//for i in `seq 1 100`; do node -e "process.stdout.write('Hello word'.repeat(1e7))" >> big.file; done
//for i in `seq 1 20`; do node -e "process.stdout.write('Hello word'.repeat(1e7))" >> big.file; done
//for i in `seq 1 10`; do node -e "process.stdout.write('Hello word'.repeat(1e7))" >> big.file; done

import {
    promises,
    createReadStream,
    statSync
} from 'node:fs'

const filename = './big.file'

try {
    const file = await promises.readFile(filename)
    console.log('fileBuffer', file)
    console.log('file size', file.byteLength / 1e9, "GB","\n")
} catch (error) {
    console.error('error: max 2gb reached...', error.message)

}

let chunkConsumed = 0;
const {size} = statSync(filename)
console.log('file size', size / 1e9, "GB","\n")

const stream = createReadStream(filename)
//65k per readable!
//triggered by the first steam.read
.once('data', msg=>{
  console.log('on data length', msg.toString().length)
})
.on('readable', _ =>{
    //thus stream.read(11) will trigger the on(data) event
  console.log('read 11 chunk bytes', stream.read(11).toString())
  console.log('read 05 chunk bytes', stream.read(5).toString())
  chunkConsumed += 11 + 5
})
.on('readable', _ =>{
  let chunk;
  //stream.read() reads max 65kbytes
  while(null !== (chunk = stream.read(11))){
    chunkConsumed += chunk.length
  }   
})
.on('end', () =>{
    console.log(`Read ${chunkConsumed / 1e9} bytes of data...`)
})
   