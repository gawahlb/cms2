import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender: string = 'Gabe Wahlberg';

  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage(): void {
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;

    const message = new Message(
      '1',
      subject,
      msgText,
      this.currentSender
    );

    this.addMessageEvent.emit(message);
    this.onClear();
  }


    onClear(): void {
      this.subject.nativeElement.value='';
      this.msgText.nativeElement.value='';
    }
  
}
