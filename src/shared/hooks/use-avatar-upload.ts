import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";

export type AvatarSource = "camera" | "gallery";

export const useAvatarUpload = (userId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (asset: ImagePicker.ImagePickerAsset): Promise<string | null> => {
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        throw new Error("Файл не должен превышать 5МБ");
      }

      const fileExt = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data } = await supabase.storage.from("avatars").list(userId);
      if (data?.length) {
        const paths = data.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("avatars").remove(paths);
      }

      const mimeType = asset.mimeType || `image/${fileExt}`;

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: fileName,
        type: mimeType,
      } as any);

      const { data: uploadData, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData, { contentType: mimeType, upsert: true });

      console.log(uploadData);
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      console.log(publicUrl);
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (profileError) throw profileError;

      return publicUrl;
    },
    [userId],
  );

  const pickFromGallery = useCallback(async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") throw new Error("Доступ к галерее запрещён");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) throw new Error("Выбор отменён");
    return await processImage(result.assets[0]);
  }, [processImage]);

  const takeFromCamera = useCallback(async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") throw new Error("Доступ к камере запрещён");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front, // или 'back'
    });

    if (result.canceled) throw new Error("Съёмка отменена");
    return await processImage(result.assets[0]);
  }, [processImage]);

  const upload = useCallback(
    async (source?: AvatarSource): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        if (source === "camera") {
          return await takeFromCamera();
        }
        if (source === "gallery") {
          return await pickFromGallery();
        }

        try {
          return await takeFromCamera();
        } catch (cameraError: any) {
          if (
            cameraError.message.includes("отмен") ||
            cameraError.message.includes("запрещён")
          ) {
            return await pickFromGallery();
          }
          throw cameraError;
        }
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [takeFromCamera, pickFromGallery],
  );

  return { upload, isUploading, error, pickFromGallery, takeFromCamera };
};
