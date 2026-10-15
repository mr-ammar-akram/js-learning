import React from "react";
import { EditorContent, useEditor, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useMemo } from 'react'

import { MenuBar } from "./MenuBar";
import './styles.css';

const extensions = [TextStyleKit, StarterKit];

export default function TipTap({ editor }) {
  const providerValue = useMemo(() => ({ editor }), [editor]);

  if (!editor) return null;

  return (
    <>
      <EditorContext.Provider value={providerValue}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </>
  );
}