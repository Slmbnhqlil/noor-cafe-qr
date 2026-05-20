import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadItemImage(file: File, itemId: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `menu/${itemId}-${Date.now()}.${ext}`;
  const storageRef = ref(storage(), path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function deleteImageByUrl(url: string) {
  try {
    const storageRef = ref(storage(), url);
    await deleteObject(storageRef);
  } catch {
    // sessizce yut: dosya yoksa veya harici URL ise
  }
}
