class Controller {
  #service

  constructor({ service }) {
    this.#service = service
  }

  async getFileStream(filename) {
    return this.#service.getFileStream(filename)
  }

}

export default Controller