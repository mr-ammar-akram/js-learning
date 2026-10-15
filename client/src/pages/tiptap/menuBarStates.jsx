export function menuBarStateSelector(ctx) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive("bold"),
    canBold: ctx.editor.can().chain().toggleBold().run(),

    isItalic: ctx.editor.isActive("italic"),
    canItalic: ctx.editor.can().chain().toggleItalic().run(),

    isStrike: ctx.editor.isActive("strike"),
    canStrike: ctx.editor.can().chain().toggleStrike().run(),

    isCode: ctx.editor.isActive("code"),
    canCode: ctx.editor.can().chain().toggleCode().run(),

    canClearMarks: ctx.editor.can().chain().unsetAllMarks().run(),

    // Block types
    isParagraph: ctx.editor.isActive("paragraph"),

    isHeading1: ctx.editor.isActive("heading", { level: 1 }),
    isHeading2: ctx.editor.isActive("heading", { level: 2 }),
    isHeading3: ctx.editor.isActive("heading", { level: 3 }),
    isHeading4: ctx.editor.isActive("heading", { level: 4 }),
    isHeading5: ctx.editor.isActive("heading", { level: 5 }),
    isHeading6: ctx.editor.isActive("heading", { level: 6 }),

    // Lists and blocks
    isBulletList: ctx.editor.isActive("bulletList"),
    isOrderedList: ctx.editor.isActive("orderedList"),
    isCodeBlock: ctx.editor.isActive("codeBlock"),
    isBlockquote: ctx.editor.isActive("blockquote"),

    // History
    canUndo: ctx.editor.can().chain().undo().run(),
    canRedo: ctx.editor.can().chain().redo().run(),

    // Link
    isLink: ctx.editor.isActive("link"),
    canSetLink: ctx.editor.can().chain().setLink({ href: "" }).run(),
    canUnsetLink: ctx.editor.can().chain().unsetLink().run(),
    linkHref: ctx.editor.getAttributes("link").href,
  };
}