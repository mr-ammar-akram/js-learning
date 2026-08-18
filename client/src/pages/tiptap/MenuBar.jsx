import React from "react";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "./menuBarStates";
import { Bold, Italic, Link, X, RemoveFormatting, Strikethrough, Code, TextIcon, Heading1, Heading2, Heading3, List, ListOrdered, Code2, Quote, Undo, Redo } from 'lucide-react'

export const MenuBar = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          <Bold size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
        >
          <Italic size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
        >
          <Strikethrough size={20} />
        </button>

        <button
            onClick={() => {
                const previousUrl = editor.getAttributes("link").href;

                const url = window.prompt("Enter URL", previousUrl);
                // const url = "";

                if (url === null) return;

                // if (url === "") {
                //     editor.chain().focus().unsetLink().run();
                //     return;
                // }

                // editor.chain().focus().setLink({ href: url }).run();
            }}
            className={editorState.isLink ? "is-active" : ""}
            >
            <Link size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? "is-active" : ""}
        >
          <Code size={20} />
        </button>

        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <X size={20} />
        </button>

        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          <RemoveFormatting size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? "is-active" : ""}
        >
          <TextIcon size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? "is-active" : ""}
        >
          <Heading1 size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? "is-active" : ""}
        >
          <Heading2 size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.isHeading3 ? "is-active" : ""}
        >
          <Heading3 size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
        >
          <List size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
        >
          <ListOrdered size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
        >
          <Code2 size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
        >
          <Quote size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo size={20} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <Redo size={20} />
        </button>
      </div>
    </div>
  );
};