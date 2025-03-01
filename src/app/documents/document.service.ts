import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
    documentSelectedEvent = new EventEmitter<Document>();

    documentChangedEvent = new EventEmitter<Document[]>();

    documentListChangedEvent = new Subject<Document[]>();

    maxDocumentId: number;

    documents: Document[] = []

    constructor() {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
    }


    getDocuments(): Document[] {
        return this.documents.slice();
    }

    getDocument(id: string): Document {
        return this.documents.find(document => document.id == id) || null;
    }

    deleteDocument(document: Document) {
        if (!document) {
           return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0) {
           return;
        }
        this.documents.splice(pos, 1);

        const documentsListClone = this.documents.slice();

        this.documentListChangedEvent.next(documentsListClone);
     }

    getMaxId(): number {
        let maxId = 0;

        for (let document of this.documents) {
            let currentId = parseInt(document.id);

            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    addDocument(newDocument: Document) {
        if (newDocument == null || !newDocument) {
            return;
        }

        const maxId = this.getMaxId();

        newDocument.id = (maxId+1).toString();

        this.documents.push(newDocument);

        const documentsListClone = this.documents.slice();

        this.documentListChangedEvent.next(documentsListClone);
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }

        const pos = this.documents.indexOf(originalDocument)

        if (pos < 0) {
            return;
        }

        newDocument.id = originalDocument.id

        this.documents[pos] = newDocument;

        const documentsListClone = this.documents.slice();

        this.documentListChangedEvent.next(documentsListClone);
    }


}