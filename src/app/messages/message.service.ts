import { EventEmitter } from "@angular/core";
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";

export class MessageService {
    messages: Message[] = []

    messageChangedEvent = new EventEmitter<Message[]>();

    constructor() {
        this.messages = MOCKMESSAGES;
    }

    getMessages(): Message[] {
        return this.messages.slice();
    }

    getMessage(id: string): Message {
        return this.messages.find(message => message.id == id) || null;
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messageChangedEvent.emit(this.messages.slice());
    }
}