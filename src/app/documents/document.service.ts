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

    private url = "http://localhost:3000/documents/";

    documents: Document[] = []

    constructor(private http: HttpClient) {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
        this.fetchDocuments();
    }

    private sortAndSend() {
        this.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.documentListChangedEvent.next(this.documents.slice());
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
        this.http.put("http://localhost:3000/documents/", stringDocuments, { headers: headers }).subscribe(() => {
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
    
        const pos = this.documents.findIndex(d => d.id === document.id);
    
        if (pos < 0) {
          return;
        }
    
        // delete from database
        this.http.delete('http://localhost:3000/documents/' + document.id)
          .subscribe(
            (response: Response) => {
              this.documents.splice(pos, 1);
              this.sortAndSend();
            }
          );
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

    addDocument(document: Document) {
        if (!document) {
          return;
        }
    
        // make sure id of the new Document is empty
        document.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // add to database
        this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents/',
          document,
          { headers: headers })
          .subscribe(
            (responseData) => {
              // add new document to documents
              this.documents.push(responseData.document);
              this.sortAndSend();
            }
          );
      }

      updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
          return;
        }
    
        const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    
        if (pos < 0) {
          return;
        }
    
        // set the id of the new Document to the id of the old Document
        newDocument.id = originalDocument.id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/documents/' + originalDocument.id,
          newDocument, { headers: headers })
          .subscribe(
            (response: Response) => {
              this.documents[pos] = newDocument;
              this.sortAndSend();
            }
          );
      }


}