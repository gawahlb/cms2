import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-edit',
  standalone: false,
  
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit{
  @ViewChild('f') documentForm: NgForm;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  subscription: Subscription;
  id: string;
  editedDocIndex: number;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.originalDocument = this.documentService.getDocument(this.id);

      if(!this.originalDocument) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });

  }

  onSubmit(form: NgForm) {
    const value = form.value;

    let newDocument = new Document(
      value.id, 
      value.name, 
      value.description, 
      value.url, 
      value.children);

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }
}
