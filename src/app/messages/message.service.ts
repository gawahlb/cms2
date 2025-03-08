import { EventEmitter, Injectable } from "@angular/core";
import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class MessageService {
    messages: Message[] = []
    maxMessageId: number;
    private url = "https://cms-project-c6bed-default-rtdb.firebaseio.com/messages.json";

    messageChangedEvent = new Subject<Message[]>();

    constructor(private http: HttpClient) {
        this.messages = MOCKMESSAGES;
        this.fetchMessages();
    }

    getMessages(): Message[] {
        return this.messages.slice();
    }

    getMessage(id: string): Message {
        return this.messages.find(message => message.id == id) || null;
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messageChangedEvent.next(this.messages.slice());
        this.storeMessages();
    }

    getMaxId(): number {
        let maxId = 0;

        for (let message of this.messages) {
            let currentId = parseInt(message.id);

            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    fetchMessages() {
            this.http.get<Message[]>(this.url)
                .subscribe(
                    (messages: Message[]) => {
                        this.messages = messages;
                        this.maxMessageId = this.getMaxId();
                        this.messageChangedEvent.next(this.messages.slice());
                    },
                    (error: any) => {
                        console.error(error);
                    }
                );
        }
    
    storeMessages() {
            const stringMessages = JSON.stringify(this.messages);
    
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
            });
            this.http.put("https://cms-project-c6bed-default-rtdb.firebaseio.com/messages.json", stringMessages, { headers: headers }).subscribe(() => {
                this.messageChangedEvent.next(this.messages.slice());
            },
            (error: any) => {
                console.error(error);
            });
        }
}