import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contacts.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit{
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {
    
  }

  ngOnInit() {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        if (!this.id) {
          this.editMode = false;
          return;
        }
  
        this.originalContact = this.contactService.getContact(this.id);
  
        if(!this.originalContact) {
          return;
        }
  
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact.group) {
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
        }
      });
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onSubmit(form: NgForm) {
      const value = form.value;
  
      let newContact = new Contact(
        value.id, 
        value.name, 
        value.email, 
        value.phone, 
        value.imageUrl,
        value.group);
  
      if (this.editMode) {
        this.contactService.updateContact(this.originalContact, newContact);
      } else {
        this.contactService
        .addContact(newContact);
      }
  
      this.router.navigate(['/contacts']);
    }

    isInvalidContact(newContact: Contact) {
      if (!newContact) {
        return true;
      } 

      if (this.contact && newContact.id === this.contact.id) {
        return true;
      }

      for (let i = 0; i < this.groupContacts.length; i++) {
        if (newContact.id === this.groupContacts[i].id) {
          return true;
        }
      }
      return false;
    }

    addToGroup($event: any) {
      const selectedContact: Contact = $event.dragData;
      const invalidGroupContact = this.isInvalidContact(selectedContact);

      if (invalidGroupContact) {
        return;
      }
      
      this.groupContacts.push(selectedContact);
    }

    onRemoveItem(index: number) {
      if (index < 0 || index >= this.groupContacts.length) {
        return;
      }

      this.groupContacts.splice(index, 1);
    }
}
