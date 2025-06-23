import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const storage = getStorage();

export async function uploadImage(file: File): Promise<string> {
  const fileRef = ref(storage, `images/${uuidv4()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
