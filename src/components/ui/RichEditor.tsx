import { Props__RichEditor } from "@/constants/props";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

const TINY_MCE_API_KEY = process.env.NEXT_PUBLIC_TINY_MCE_API_KEY || "";

export const RichEditor = (props: Props__RichEditor) => {
  // Props
  const { inputValue = "", onChange, ...restProps } = props;

  return (
    <TinyMCEEditor
      apiKey={TINY_MCE_API_KEY}
      init={{
        height: 720,
        menubar: false,
        plugins: "lists link image table code help wordcount",
        toolbar:
          "undo redo | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help | " +
          "h1 h2 h3 h4 h5 h6",
        style_formats: [
          { title: "Heading 1", format: "h1" },
          { title: "Heading 2", format: "h2" },
          { title: "Heading 3", format: "h3" },
          { title: "Heading 4", format: "h4" },
          { title: "Heading 5", format: "h5" },
          { title: "Heading 6", format: "h6" },
        ],
        highlight_on_focus: false,
      }}
      value={inputValue}
      onEditorChange={(content) => {
        onChange?.(content);
      }}
      {...restProps}
    />
  );
};
