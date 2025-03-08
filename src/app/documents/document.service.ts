import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class DocumentService {
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;

    private url = "https://cms-project-c6bed-default-rtdb.firebaseio.com/documents.json";

    documents: Document[] = []

    constructor(private http: HttpClient) {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
        this.fetchDocuments();
    }

    fetchDocuments() {
        this.http.get<Document[]>(this.url)
            .subscribe(
                (documents: Document[]) => {
                    this.documents = documents;
                    this.maxDocumentId = this.getMaxId();
                    this.documents.sort((a,b) => a.name.localeCompare(b.name));
                    this.documentListChangedEvent.next(this.documents.slice());
                },
                (error: any) => {
                    console.error(error);
                }
            );
    }

    storeDocuments() {
        const stringDocuments = JSON.stringify(this.documents);

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        this.http.put("https://cms-project-c6bed-default-rtdb.firebaseio.com/documents.json", stringDocuments, { headers: headers }).subscribe(() => {
            this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
            console.error(error);
        });
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

        this.storeDocuments();
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

        this.storeDocuments();
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

        //this.documents[pos] = newDocument;

        this.documents = this.documents.map((doc, index) => {
            if (index === pos) {
                return newDocument;
            }
            return doc;
        });        

        this.storeDocuments();
    }


}