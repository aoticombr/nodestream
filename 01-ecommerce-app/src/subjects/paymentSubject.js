export default class PaymentSubject {
    #observers = new Set();

    notify(data) {
        this.#observers.forEach(observer => observer.update(data));
    }

    unsubscribe(observer) {
        this.#observers.delete(observer);
    }
    subscribe(observer) {
        this.#observers.add(observer);
    }
}