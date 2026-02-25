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
    const extension = name?.toLowerCase().split(".").pop() ?? "";
    const mime = mimeType?.toLowerCase() ?? "";

    let iconColor = "current";
    let IconComponent = IconFile;

    switch (true) {
      case ["application/pdf"].some((v) => mime.includes(v)) ||
        ["pdf"].includes(extension):
        iconColor = "fg.error";
        IconComponent = IconFileTypePdf;
        break;

      case [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].some((v) => mime.includes(v)) || ["doc", "docx"].includes(extension):
        iconColor = "blue.500";
        IconComponent = IconFileTypeDoc;
        break;

      case [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ].some((v) => mime.includes(v)) ||
        ["xls", "xlsx", "csv"].includes(extension):
        iconColor = ["csv"].includes(extension) ? "green.600" : "green.500";
        IconComponent = ["csv"].includes(extension)
          ? IconFileTypeCsv
          : IconFileTypeXls;
        break;

      case mime.includes("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension):
        iconColor = "purple.500";
        IconComponent = IconPhoto;
        break;

      case ["application/zip", "application/x-zip"].some((v) =>
        mime.includes(v),
      ) || ["zip"].includes(extension):
        iconColor = "orange.500";
        IconComponent = IconFileZip;
        break;
    }

    return (
      <ChakraIcon ref={ref} color={`${iconColor} !important`} {...restProps}>
        <IconComponent stroke={1.5} {...iconProps} />
      </ChakraIcon>
    );
  },
);

FileIcon.displayName = "FileIcon";
