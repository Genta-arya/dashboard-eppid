import React from "react";
import DOMPurify from "dompurify";

import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
const Editor = ({ editorContent = "", setEditorContent }) => {
  const handlePostClick = () => {
    let sanitizedContent = DOMPurify.sanitize(editorContent);

    const div = document.createElement("div");
    div.innerHTML = sanitizedContent;
    const poweredByElements = div.querySelectorAll("p");

    poweredByElements.forEach((element) => {
      if (element.textContent.includes("Powered by")) {
        element.remove();
      }
    });

    sanitizedContent = div.innerHTML;
  };

  const handleModelChange = (content) => {
    setEditorContent(content);
  };

  return (
    <FroalaEditor
      model={editorContent}
      onModelChange={handleModelChange}
      config={{
        toolbarButtons: [
          "bold",
          "italic",
          "underline",
          "insertLink",
          "formatOL",
          "formatUL",
          "alignLeft",
          "alignCenter",
          "alignRight",
          "alignJustify",
          "quote",
          " table",
          "paragraphFormat",
          "paragraphStyle",
          "fontSize",
          "textColor",
          "backgroundColor",
          "markdown",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "clearFormatting",
          "print",
          "getPDF",
          "spellChecker",
          "html",
          "help",
          "fullscreen",
          "undo",
          "redo",
          "removeFormat",
          "insertImage",
          "insertTable",
          "outdent",

          "indent",
        ],
        events: {
          "froalaEditor.initialized": function () {
            console.log("Froala Editor initialized");
          },
          "froalaEditor.contentChanged": function () {
            console.log("Content changed");
          },
          "froalaEditor.focus": function () {
            console.log("Editor focused");
          },
          "froalaEditor.blur": function () {
            console.log("Editor blurred");
          },
          // 'image.beforeUpload': function (files) {
          //   return false; // Mencegah upload gambar
          // },
          // 'image.inserted': function ($img, response) {
          //   $img.remove(); // Menghapus gambar yang sudah dimasukkan
          // },
        },
        imageUpload: false,
        imageManagerUpload: false,
        videoUpload: false,
        videoManagerUpload: false,
      }}
    />
  );
};

export default Editor;
