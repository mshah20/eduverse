import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect } from 'react';
import Link from '@tiptap/extension-link'

const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https'
  })
]



const MenuBar = ({ editor }) => {

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
    
        // cancelled
        if (url === null) {
            return
        }
    
        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()
    
            return
        }
    
        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])

    if(!editor) {
        return null;
    }

    return (
        <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-6'>
            <button
                className={editor.isActive('bold') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </button>
            <button
                className={editor.isActive('italic') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </button>
            <button
                className={editor.isActive('heading', { level: 1 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                Heading 1
            </button>
            <button
                className={editor.isActive('heading', { level: 2 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                Heading 2
            </button>
            <button
                className={editor.isActive('heading', { level: 3 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                Heading 3
            </button>
            <button
                className={editor.isActive('heading', { level: 4 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            >
                Heading 4
            </button>
            <button
                className={editor.isActive('heading', { level: 5 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            >
                Heading 5
            </button>
            <button
                className={editor.isActive('heading', { level: 6 }) 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            >
                Heading 6
            </button>
            <button
                className={editor.isActive('bulletList') 
                ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
            }
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                Bullet list
            </button>
            <button
                className={editor.isActive('orderedList') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                Ordered list
            </button>
            <button
                className={editor.isActive('codeBlock') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                Code block
            </button>
            <button
                className={editor.isActive('blockquote') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                Blockquote
            </button>
            <button
                className={editor.isActive('blockquote') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={setLink}
            >
                Set link
            </button>
            <button
                className={editor.isActive('blockquote') 
                    ? 'border-2 border-black px-3 py-1 rounded bg-blue-950 text-slate-50'
                    : 'border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                }
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
            >
                Unset link
            </button>
            <button 
                className='border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                Horizontal rule
            </button>
            <button
                className='border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50' 
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                Hard break
            </button>
            <button
                className='border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={
                    !editor.can()
                    .chain()
                    .focus()
                    .undo()
                    .run()
                }
            >
                Undo
            </button>
            <button
                className='border-2 border-black px-3 py-1 rounded hover:bg-blue-950 hover:text-slate-50'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={
                    !editor.can()
                    .chain()
                    .focus()
                    .redo()
                    .run()
                }
            >
                Redo
            </button>
        </div>
    )
}

const Tiptap = ({ onEditorContentSave, content, input }) => {
    const editor = useEditor({
        extensions,
        content
    })

    const handleSave = (editor) => {
        // send to parent component
        onEditorContentSave(editor.getHTML())
    }

    useEffect(() => {
        if(!editor) {
            return;
        }

        if(input !== '') {
            editor.commands.setContent(input)
        }
    }, [editor, input])

    return (
        <div className='flex flex-col bg-slate-100 rounded w-[80%] mx-auto p-6 drop-shadow'>
            <MenuBar editor={editor} />
            <EditorContent 
                editor={editor}
            />
            
            <button className='mx-auto mt-4 px-4 py-2 rounded bg-green-500 text-slate-50 hover:bg-green-600 active:scale-[0.98]' 
                onClick={() => handleSave(editor)}
            >
                Save Changes
            </button>
        </div>
  )
}

export default Tiptap;