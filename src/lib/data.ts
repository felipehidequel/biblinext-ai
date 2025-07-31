
import { collection, getDocs, doc, getDoc, query, where, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Book, Loan, LoanRequest } from './types';

// Type guards to check if a document snapshot has data
function isBook(doc: QueryDocumentSnapshot<DocumentData>): doc is QueryDocumentSnapshot<Book> {
    const data = doc.data();
    return data.title !== undefined && data.author !== undefined;
}

function isUser(doc: QueryDocumentSnapshot<DocumentData>): doc is QueryDocumentSnapshot<User> {
    const data = doc.data();
    return data.name !== undefined && data.email !== undefined;
}

function isLoanRequest(doc: QueryDocumentSnapshot<DocumentData>): doc is QueryDocumentSnapshot<LoanRequest> {
    const data = doc.data();
    return data.bookId !== undefined && data.userId !== undefined && data.status !== undefined;
}

// Generic function to convert a snapshot to an array of a specific type
async function getCollectionData<T>(collectionName: string, typeGuard: (doc: QueryDocumentSnapshot<DocumentData>) => doc is QueryDocumentSnapshot<T>): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
        if (typeGuard(doc)) {
            data.push({ id: doc.id, ...doc.data() } as T);
        }
    });
    return data;
}

// Data access functions
export const getBooks = async (): Promise<Book[]> => getCollectionData('books', isBook);
export const getBookById = async (id: string): Promise<Book | undefined> => {
    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Book;
    }
};

export const getUsers = async (): Promise<User[]> => getCollectionData('users', isUser);
export const getUserById = async (id: string): Promise<User | undefined> => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
    }
};


export const getPendingRequests = async (): Promise<LoanRequest[]> => {
    const q = query(collection(db, "requests"), where("status", "==", "Pendente"));
    const querySnapshot = await getDocs(q);
    const requests: LoanRequest[] = [];
    
    for (const docSnap of querySnapshot.docs) {
        if(isLoanRequest(docSnap)) {
            const requestData = docSnap.data();
            const [book, user] = await Promise.all([
                getBookById(requestData.bookId),
                getUserById(requestData.userId),
            ]);

            if (book && user) {
                 requests.push({ id: docSnap.id, ...requestData, book, user });
            }
        }
    }
    return requests;
};

// This is a simplified function. In a real app, you'd get the current authenticated user.
export const getCurrentUser = async (): Promise<User | undefined> => {
    // For now, we'll just fetch a user we know is an admin.
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        return { id: adminDoc.id, ...adminDoc.data()} as User;
    }
};
