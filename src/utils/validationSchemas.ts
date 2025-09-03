import JSZip from "jszip";
import * as yup from "yup";

type FileValidationParams = {
  maxSizeMB?: number;
  allowedExtensions?: string[];
  min?: number;
  checkZip?: boolean;
};

export const fileValidation = ({
  maxSizeMB = 10,
  allowedExtensions,
  checkZip = false,
}: FileValidationParams = {}): yup.MixedSchema =>
  yup
    .mixed<File[]>()
    .test("fileType", "file required", (value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.every((item) => item instanceof File);
    })
    .test("fileSize", "file size too large", (value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      if (maxSizeMB) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return value.every((file) => file.size <= maxSizeBytes);
      }
      return true;
    })
    .test(
      "fileExtension",
      `Supported extensions: ${allowedExtensions?.join(", ") || "all"}`,
      (value) => {
        if (!value || !Array.isArray(value)) return true;

        if (!allowedExtensions || allowedExtensions.length === 0) return true;

        return value.every((file) => {
          if (!file?.name) return false;

          const fileExtension = file.name
            .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
            .toLowerCase();

          return allowedExtensions.includes(`${fileExtension}`);
        });
      }
    )
    .test(
      "zipContents",
      "ZIP file must contain at least one valid file",
      async (value) => {
        if (!Array.isArray(value) || value.length === 0) return true;

        if (checkZip) {
          // Cek apakah checkZip diaktifkan
          for (const file of value) {
            if (file.name.endsWith(".zip")) {
              try {
                const zip = await JSZip.loadAsync(file);
                const filesInZip = Object.keys(zip.files);

                if (filesInZip.length === 0) return false; // ZIP empty

                const hasValidFile = filesInZip.some((fileName) => {
                  const fileExtension = fileName
                    .split(".")
                    .pop()
                    ?.toLowerCase();
                  return allowedExtensions?.includes(fileExtension || "");
                });

                if (!hasValidFile) return false; // no match file in ZIP
              } catch (error) {
                console.error("check zip error", error);
                return false; // ZIP corrupt
              }
            }
          }
        }

        return true;
      }
    );
