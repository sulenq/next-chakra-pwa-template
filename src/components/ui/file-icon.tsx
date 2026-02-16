import { Icon as ChakraIcon, IconProps } from "@chakra-ui/react";
import {
  IconFile,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileTypeXls,
  IconFileZip,
  IconPhoto,
} from "@tabler/icons-react";
import { forwardRef } from "react";

interface Props extends IconProps {
  name?: string;
  mimeType?: string;
  iconProps?: any;
}

export const FileIcon = forwardRef<SVGSVGElement, Props>(
  ({ name, mimeType, iconProps, ...restProps }, ref) => {
    const extension = name?.toLowerCase().split(".").pop() as string;
    const mime = mimeType?.toLowerCase();

    let iconColor = "current";
    let IconComponent = IconFile;

    // Prioritize mimeType first, then fallback to extension
    switch (true) {
      // PDF Files
      case mime === "application/pdf" || extension === "pdf":
        iconColor = "fg.error";
        IconComponent = IconFileTypePdf;
        break;

      // Word Documents
      case mime === "application/msword" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        ["doc", "docx"].includes(extension):
        iconColor = "blue.500";
        IconComponent = IconFileTypeDoc;
        break;

      // Excel Files
      case mime === "application/vnd.ms-excel" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        ["xls", "xlsx", "csv"].includes(extension):
        iconColor = extension === "csv" ? "green.600" : "green.500";
        IconComponent = extension === "csv" ? IconFileTypeCsv : IconFileTypeXls;
        break;

      // Images
      case mime?.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension):
        iconColor = "purple.500";
        IconComponent = IconPhoto;
        break;

      // ZIP Archives
      case mime === "application/zip" ||
        mime === "application/x-zip-compressed" ||
        extension === "zip":
        iconColor = "orange.500";
        IconComponent = IconFileZip;
        break;
    }

    return (
      <ChakraIcon ref={ref} color={`${iconColor} !important`} {...restProps}>
        <IconComponent stroke={1.5} {...iconProps} />
      </ChakraIcon>
    );
  }
);

FileIcon.displayName = "FileIcon";
