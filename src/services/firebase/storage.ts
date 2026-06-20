import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { app } from './config';

export const storage = getStorage(app);

export async function uploadPhoto(
  userId: string,
  folder: 'profile' | 'activity' | 'meal',
  fileUri: string,
  fileName?: string
): Promise<string> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const extension = fileName?.split('.').pop() ?? 'jpg';
  const timestamp = Date.now();
  const storagePath = `${folder}s/${userId}/${timestamp}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}

export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
