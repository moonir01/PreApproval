"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextAlign } from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  UnderlineIcon,
  Quote,
  Smile,
  Strikethrough,
  Scissors,
  Copy,
  ClipboardPaste,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Video,
  Code,
  Eye,
  ChevronDown,
  IndentDecrease,
  IndentIncrease,
} from "lucide-react"
import { useState } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showTextColor, setShowTextColor] = useState(false)
  const [showHighlightColor, setShowHighlightColor] = useState(false)

  const editor = useEditor({
    // Prevent Tiptap from rendering during SSR to avoid hydration mismatches
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  if (!editor) {
    return null
  }

  const charCount = editor.state.doc.textContent.length

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar - First Row */}
      <div className="bg-muted/50 border-b px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Text Formatting */}
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        {/* Text Color */}
        <div className="relative">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowTextColor(!showTextColor)}
            className="h-8 w-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">A</span>
              <div
                className="w-4 h-1 rounded"
                style={{ backgroundColor: editor.getAttributes("textStyle").color || "#000000" }}
              />
            </div>
          </Button>
          {showTextColor && (
            <div className="absolute top-full mt-1 z-10 bg-popover border rounded-md shadow-md p-2">
              <input
                type="color"
                onInput={(e) => {
                  editor
                    .chain()
                    .focus()
                    .setColor((e.target as HTMLInputElement).value)
                    .run()
                  setShowTextColor(false)
                }}
                value={editor.getAttributes("textStyle").color || "#000000"}
                className="h-8 w-20 cursor-pointer"
              />
            </div>
          )}
        </div>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-6 px-0">
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Highlight Color */}
        <div className="relative">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowHighlightColor(!showHighlightColor)}
            className="h-8 w-8"
          >
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
            </div>
          </Button>
          {showHighlightColor && (
            <div className="absolute top-full mt-1 z-10 bg-popover border rounded-md shadow-md p-2">
              <input
                type="color"
                onInput={(e) => {
                  editor
                    .chain()
                    .focus()
                    .setHighlight({ color: (e.target as HTMLInputElement).value })
                    .run()
                  setShowHighlightColor(false)
                }}
                className="h-8 w-20 cursor-pointer"
              />
            </div>
          )}
        </div>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-6 px-0">
          <ChevronDown className="h-3 w-3" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          size="icon"
          variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="h-8 w-8"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="h-8 w-8"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="h-8 w-8"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className="h-8 w-8"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-6 px-0">
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-6 px-0">
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Indent */}
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <IndentDecrease className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <IndentIncrease className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Quote & Emoji */}
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Smile className="h-4 w-4" />
        </Button>
      </div>

      {/* Toolbar - Second Row */}
      <div className="bg-muted/50 border-b px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Scissors className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Copy className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <ClipboardPaste className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" disabled>
          <Video className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="max-w-none p-4 min-h-[200px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-0"
        />

        {/* Footer with character count */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">characters: {charCount}</div>
      </div>
    </div>
  )
}
