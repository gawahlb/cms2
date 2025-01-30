import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: false,
  
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent {
  @Input() contact: Contact;

  constructor() {
    this.contact = new Contact(
      'id',
      'name',
      'email',
      'phone number',
      'imgUrl',
      []
    )
  }
}
