import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
   contactSelectedEvent = new EventEmitter<Contact>();
   contactChangedEvent = new EventEmitter<Contact[]>();
   contactListChangedEvent = new Subject<Contact[]>();
   contacts: Contact [] =[];

   private url = "http://localhost:3000/contacts/";

   constructor(private http: HttpClient) {
      this.contacts = MOCKCONTACTS;
      this.fetchContacts();
   }

   fetchContacts() {
           this.http.get<Contact[]>(this.url)
               .subscribe(
                   (contacts: Contact[]) => {
                       this.contacts = contacts;
                       this.contactListChangedEvent.next(this.contacts.slice());
                   },
                   (error: any) => {
                       console.error(error);
                   }
               );
    }

    storeContacts() {
        const stringContacts = JSON.stringify(this.contacts);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        this.http.put("http://localhost:3000/contacts/", stringContacts, { headers: headers }).subscribe(() => {
            this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
            console.error(error);
        });
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

      this.storeContacts();
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
   
           this.storeContacts();
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
   
           this.storeContacts();
       }

}