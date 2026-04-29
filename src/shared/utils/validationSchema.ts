import JSZip from "jszip";
import * as yup from "yup";

type FileValidationParams = {
  maxFileSizeMB?: number;
  allowedExtensions?: string[];
  min?: number;
  max?: number;
  checkZip?: boolean;
};

export const fileValidation = ({
  maxFileSizeMB = 10,
  allowedExtensions,
  min,
  max,
  checkZip = false,
}: FileValidationParams = {}): yup.MixedSchema =>
  yup
    .mixed<File[]>()
    // file required & type check
    .test("fileType", "file required", (value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.every((item) => item instanceof File);
    })
    // file count min
    .test("fileMin", `Minimum ${min} file(s) required`, (value) => {
      if (!min) return true;
      if (!Array.isArray(value)) return true;
      return value.length >= min;
    })
    // file count max
    .test("fileMax", `Maximum ${max} file(s) allowed`, (value) => {
      if (!max) return true;
      if (!Array.isArray(value)) return true;
      return value.length <= max;
    })
    // file size check
    .test("fileSize", "file size too large", (value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      if (maxFileSizeMB) {
        const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
        return value.every((file) => file.size <= maxSizeBytes);
      }
      return true;
    })
    // file extension check
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

          return allowedExtensions.includes(fileExtension);
        });
      },
    )
    // zip contents check
    .test(
      "zipContents",
      "ZIP file must contain at least one valid file",
      async (value) => {
        if (!Array.isArray(value) || value.length === 0) return true;

        if (checkZip) {
          for (const file of value) {
            if (file.name.endsWith(".zip")) {
              try {
                const zip = await JSZip.loadAsync(file);
                const filesInZip = Object.keys(zip.files);

                if (filesInZip.length === 0) return false;

                const hasValidFile = filesInZip.some((fileName) => {
                  const fileExtension = fileName
                    .split(".")
                    .pop()
                    ?.toLowerCase();
                  return allowedExtensions?.includes(fileExtension || "");
                });

                if (!hasValidFile) return false;
              } catch (error) {
                console.error("check zip error", error);
                return false;
              }
            }
          }
        }

        return true;
      },
    );

type min1FileParams = {
  resolvedData: Record<string, any>;
  existingKey: string;
  deletedKey: string;
  newKey: string;
  message?: string;
};
export function min1File({
  resolvedData,
  existingKey,
  deletedKey,
  newKey,
  message = "At least one item is required",
}: min1FileParams) {
  return yup
    .mixed()
    .test("must-have-at-least-one-item", message, function (_, ctx) {
      const { parent } = ctx;

      const existingCount = resolvedData?.[existingKey]?.length || 0;
      const deletedCount = parent?.[deletedKey]?.length || 0;
      const newCount = parent?.[newKey]?.length || 0;

      const remaining = existingCount - deletedCount + newCount;
      return remaining > 0;
    });
}
