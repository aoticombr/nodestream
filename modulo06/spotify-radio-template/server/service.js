import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import config from './config.js'

const {
    dir: {
        publicDirectory
    },
} = config

class Service {

    #createFileStream(file) {
        return fs.createReadStream(file)
    }

    async getFileInfo(file) {
        const fullPathFile = path.join(publicDirectory, file)
        await fsPromises.access(fullPathFile)
        const fileType = path.extname(fullPathFile)
        return {
            type: fileType,
            name: fullPathFile
        }
    }

    async getFileStream(file) {
        const {
            name,
            type
        } = await this.getFileInfo(file)

        return {
            stream: this.#createFileStream(name),
            type
        }
    }
}

export default Service