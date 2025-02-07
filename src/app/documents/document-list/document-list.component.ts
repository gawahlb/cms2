import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'doc1',
      'This is doc1.',
      'doc1 url',
      []
    ),
    new Document(
      '2',
      'doc2',
      'This is doc2.',
      'doc2 url',
      []
    ),
    new Document(
      '3',
      'doc3',
      'This is doc3.',
      'doc3 url',
      []
    ),
    new Document(
      '4',
      'doc4',
      'This is doc4.',
      'doc4 url',
      []
    )
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
