import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(
      '1',
      'subject1',
      'This is message 1',
      'me'
    ),

    new Message(
      '2',
      'subject2',
      'This is message 2',
      'me'
    ),

    new Message(
      '3',
      'subject3',
      'This is message 3',
      'me'
    )
  ]

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
