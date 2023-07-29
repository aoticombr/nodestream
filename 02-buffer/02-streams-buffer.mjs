 //for i in `seq 1 100`; do node -e "process.stdout.write('$i-Hello word\n')" >> text.txt; done

 import {
    readFile

 } from 'fs/promises';

 //if it`s a big file, it`s crash or make your program slow down
 const data = (await readFile('./text.txt')).toString('utf-8').split('\n');
 const LINES_POR_ITERACTION = 10;
 const interations = data.length / LINES_POR_ITERACTION; //ten in ten lines (not bytes!)
 let page = 0

 for (let index = 0; index < interations; index++) {
     const chunk = data.slice(page, page += LINES_POR_ITERACTION).join('\n');

     //imagem this as the maximum 2gb buffer node.js can handle per time
     const buffer = Buffer.from(chunk);
     const amountOfBytes = buffer.byteOffset
     const bufferData = buffer.toString('utf-8').split('\n');
     const amountOfLines = bufferData.length;

     //nos the bufferdata would be splitted int samll pieces and processed individually
     console.log('processing', bufferData, `lines: ${amountOfLines} bytes: ${amountOfBytes}`)
 }