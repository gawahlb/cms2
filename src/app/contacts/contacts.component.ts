import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: false,
  
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  selectedContact: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
      this.contactService.contactSelectedEvent.subscribe(
        (contact: Contact) => {
          this.selectedContact = contact;
        }
      )
  }
}
