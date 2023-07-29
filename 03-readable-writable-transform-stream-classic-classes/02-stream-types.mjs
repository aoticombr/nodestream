import {
    Readable,
    Writable,
    Transform,
} from 'stream';
import {randomUUID} from 'node:crypto';
import { read, createWriteStream } from 'fs';

//data source: file, database, website, anything you can consume on demand!

const readable = Readable({
    read() {
    // 1.000.000 
      for (let i = 0; i < 1e6; i++) {
        const person = { id: randomUUID(), name: `person-${i}` }
        const data = JSON.stringify(person)
        this.push(data)
      }
      //notify that the data is empty(consumed everything)
      this.push(null)
    }
})
const mapFields = Transform({
    transform(chunk, enc, cb) {
       const data = JSON.parse(chunk)
       const result = `${data.id},${data.name.toUpperCase()}\n`
       cb(null, result)
    }
})    

const mapHeaders = Transform({
    transform(chunk, enc, cb) {
        this.counter = this.counter ?? 0;
        if (this.counter) {
            return cb(null, chunk)
        }
        this.counter++
        cb(null, 'id,name\n'.concat(chunk))
    }
})

const pipeline = readable
.pipe(mapFields)
.pipe(mapHeaders)
.pipe(createWriteStream('./output.csv'))

pipeline.on('end', () => console.log('task finished...'))