import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useBlocks } from '../hooks/useBlocks';
import { usePages } from '../hooks/usePages';
import { AUTOSAVE_DELAY, BLOCK_TYPES } from '../utils/constants';
import { BlockType } from '../utils/constants';

interface EditorProps {
  pageId: string;
}

const Editor = ({ pageId }: EditorProps) => {
  const { blocks, createBlock, updateBlock, deleteBlock, reorderBlocks } =
    useBlocks(pageId);
  const { pages } = usePages();
  const page = pages.find((p) => p._id === pageId);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      CodeBlock.configure({
        languageClassPrefix: 'language-',
      }),
      Blockquote,
      HorizontalRule,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Auto-save with debouncing
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave(editor.getHTML());
      }, AUTOSAVE_DELAY);
    },
    onCreate: ({ editor }) => {
      // Load existing content
      if (blocks.length > 0) {
        const content = blocks
          .sort((a, b) => a.order - b.order)
          .map((block) => {
            switch (block.type) {
              case BLOCK_TYPES.HEADING:
                const level = block.content.startsWith('###')
                  ? 3
                  : block.content.startsWith('##')
                  ? 2
                  : 1;
                const headingText = block.content.replace(/^#+\s*/, '');
                return `<h${level}>${headingText}</h${level}>`;
              case BLOCK_TYPES.LIST:
                return `<ul><li>${block.content}</li></ul>`;
              case BLOCK_TYPES.TODO:
                return `<ul><li data-type="task-item" data-checked="${block.completed}">${block.content}</li></ul>`;
              case BLOCK_TYPES.CODE:
                return `<pre><code>${block.content}</code></pre>`;
              case BLOCK_TYPES.QUOTE:
                return `<blockquote>${block.content}</blockquote>`;
              case BLOCK_TYPES.DIVIDER:
                return `<hr>`;
              default:
                return `<p>${block.content}</p>`;
            }
          })
          .join('');

        editor.commands.setContent(content);
      }
    },
  });

  const handleAutoSave = async (content: string) => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      // Parse content and update/create blocks
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const elements = Array.from(doc.body.children);

      // Clear existing blocks and recreate
      for (const block of blocks) {
        await deleteBlock(block._id);
      }

      let order = 0;
      for (const element of elements) {
        let type: BlockType = BLOCK_TYPES.TEXT;
        let blockContent = element.textContent || '';

        switch (element.tagName.toLowerCase()) {
          case 'h1':
            type = BLOCK_TYPES.HEADING;
            blockContent = `# ${blockContent}`;
            break;
          case 'h2':
            type = BLOCK_TYPES.HEADING;
            blockContent = `## ${blockContent}`;
            break;
          case 'h3':
            type = BLOCK_TYPES.HEADING;
            blockContent = `### ${blockContent}`;
            break;
          case 'ul':
            if (element.querySelector('[data-type="task-item"]')) {
              type = BLOCK_TYPES.TODO;
              const taskItem = element.querySelector('[data-type="task-item"]');
              blockContent = taskItem?.textContent || '';
            } else {
              type = BLOCK_TYPES.LIST;
              blockContent = element.querySelector('li')?.textContent || '';
            }
            break;
          case 'ol':
            type = BLOCK_TYPES.LIST;
            blockContent = element.querySelector('li')?.textContent || '';
            break;
          case 'pre':
            type = BLOCK_TYPES.CODE;
            blockContent = element.querySelector('code')?.textContent || '';
            break;
          case 'blockquote':
            type = BLOCK_TYPES.QUOTE;
            break;
          case 'hr':
            type = BLOCK_TYPES.DIVIDER;
            blockContent = '';
            break;
          default:
            type = BLOCK_TYPES.TEXT;
        }

        if (blockContent.trim()) {
          await createBlock({
            type,
            content: blockContent,
            pageId,
            order: order++,
          });
        }
      }
      toast.success('Saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pageId]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-text mb-2">
          {page?.title || 'Untitled'}
        </h1>
        <div className="flex items-center space-x-2 text-muted text-sm">
          <span>
            Last updated:{' '}
            {page?.updatedAt
              ? new Date(page.updatedAt).toLocaleDateString()
              : 'Never'}
          </span>
          <AnimatePresence>
            {isSaving && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-primary"
              >
                Saving...
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none dark:prose-invert"
      >
        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
        />
      </motion.div>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 bg-muted/20 rounded-lg text-sm text-muted"
      >
        <h3 className="font-medium text-text mb-2">Keyboard Shortcuts:</h3>
        <div className="grid grid-cols-2 gap-2">
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">/</kbd>{' '}
            Command menu
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs"># ## ###</kbd>{' '}
            Headings
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">- *</kbd>{' '}
            Lists
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">```</kbd> Code
            blocks
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">{'>'}</kbd>{' '}
            Quotes
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">---</kbd>{' '}
            Dividers
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Editor;
