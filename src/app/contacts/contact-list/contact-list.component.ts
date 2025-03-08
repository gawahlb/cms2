import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contacts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit, OnDestroy{
  subscription: Subscription;
  term: string;

  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit() {
      this.contacts = this.contactService.getContacts();

      this.subscription = this.contactService.contactListChangedEvent.subscribe((contactsList: Contact[]) =>{
        this.contacts = contactsList;
      })
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  search(value: string) {
    this.term = value;
  }

}
