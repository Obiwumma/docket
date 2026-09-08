declare module "firebase/app" {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
  export function getApp(): any;
}

declare module "firebase/firestore" {
  export interface DocumentData {
    [field: string]: any;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: QueryDocumentSnapshot<T>[];
  }

  export function getFirestore(app?: any): any;
  export function collection(db: any, path: string, ...pathSegments: string[]): any;
  export function query(query: any, ...queryConstraints: any[]): any;
  export function orderBy(fieldPath: string, directionStr?: "asc" | "desc"): any;
  export function onSnapshot(
    query: any,
    onNext: (snapshot: QuerySnapshot) => void,
    onError?: (error: any) => void
  ): () => void;
  export function addDoc(collectionRef: any, data: any): Promise<any>;
  export function updateDoc(docRef: any, data: any): Promise<void>;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function serverTimestamp(): any;
}
