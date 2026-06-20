import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
  DocumentData,
  WithFieldValue,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export { db };

export async function getDocument<T = DocumentData>(
  path: string,
  ...pathSegments: string[]
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, path, ...pathSegments);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export async function setDocument<T extends object>(
  path: string,
  data: T,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  } as WithFieldValue<DocumentData>);
}

export async function createDocument<T extends object>(
  path: string,
  data: T,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<DocumentData>);
}

export async function updateDocument<T extends object>(
  path: string,
  data: Partial<T>,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  } as WithFieldValue<DocumentData>);
}

export async function deleteDocument(path: string, ...pathSegments: string[]): Promise<void> {
  const docRef = doc(db, path, ...pathSegments);
  await deleteDoc(docRef);
}

export async function getCollection<T = DocumentData>(
  path: string,
  ...pathSegments: string[]
): Promise<(T & { id: string })[]> {
  const collectionRef = collection(db, path, ...pathSegments);
  const querySnapshot = await getDocs(collectionRef);
  return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as (T & { id: string })[];
}

export async function queryCollection<T = DocumentData>(
  path: string,
  conditions: {
    field: string;
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'array-contains';
    value: unknown;
  }[],
  orderByField?: string,
  orderDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<(T & { id: string })[]> {
  let collectionRef = collection(db, path);

  let q = query(collectionRef);
  for (const condition of conditions) {
    q = query(q, where(condition.field, condition.operator, condition.value));
  }
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection ?? 'asc'));
  }
  if (limitCount !== undefined) {
    q = query(q, limit(limitCount));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as (T & { id: string })[];
}

export async function addToCollection<T extends object>(
  path: string,
  data: T,
  ...pathSegments: string[]
): Promise<string> {
  const collectionRef = collection(db, path, ...pathSegments);
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<DocumentData>);
  return docRef.id;
}

export function serverTimestampValue() {
  return serverTimestamp();
}
