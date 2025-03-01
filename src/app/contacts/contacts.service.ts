import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
   contactSelectedEvent = new EventEmitter<Contact>();

   contactChangedEvent = new EventEmitter<Contact[]>();

   contactListChangedEvent = new Subject<Contact[]>();

   contacts: Contact [] =[];

   constructor() {
      this.contacts = MOCKCONTACTS;
   }

   getContacts(): Contact[] {
    return this.contacts.slice();
   }

   getContact(id: string): Contact {
    return this.contacts.find(contact => contact.id == id) || null;
   }

   deleteContact(contact: Contact) {
      if (!contact) {
         return;
      }
      const pos = this.contacts.indexOf(contact);
      if (pos < 0) {
         return;
      }
      this.contacts.splice(pos, 1);

      const contactsListClone = this.contacts.slice();
      
      this.contactListChangedEvent.next(contactsListClone);
   }

   getMaxId(): number {
           let maxId = 0;
   
           for (let contact of this.contacts) {
               let currentId = parseInt(contact.id);
   
               if (currentId > maxId) {
                   maxId = currentId;
               }
           }
   
           return maxId;
       }
   
       addContact(newContact: Contact) {
           if (newContact == null || !newContact) {
               return;
           }
   
           const maxId = this.getMaxId();
   
           newContact.id = (maxId+1).toString();
   
           this.contacts.push(newContact);
   
           const contactsListClone = this.contacts.slice();
   
           this.contactListChangedEvent.next(contactsListClone);
       }
   
       updateContact(originalContact: Contact, newContact: Contact) {
           if (!originalContact || !newContact) {
               return;
           }
   
           const pos = this.contacts.indexOf(originalContact)
   
           if (pos < 0) {
               return;
           }
   
           newContact.id = originalContact.id
   
           this.contacts[pos] = newContact;
   
           const contactsListClone = this.contacts.slice();
   
           this.contactListChangedEvent.next(contactsListClone);
       }

}