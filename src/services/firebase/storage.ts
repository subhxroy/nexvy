import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { app } from './config';

export const storage = getStorage(app);

export async function uploadPhoto(
  userId: string,
  folder: 'profile' | 'activity' | 'meal',
  fileUri: string,
  fileName?: string
): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const extension = fileName?.split('.').pop() ?? 'jpg';
  const timestamp = Date.now();
  const storagePath = `${folder}s/${userId}/${timestamp}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadString(storageRef, base64, 'base64', {
    contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
  });
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
