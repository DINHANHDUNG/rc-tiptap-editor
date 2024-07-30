/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable import/named */
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';

import { AnyExtension, Editor as CoreEditor } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import { differenceBy, throttle } from 'lodash-unified';

import ContentMenu from '@/components/menus/components/ContentMenu';
import LinkBubbleMenu from '@/components/menus/components/LinkBubbleMenu';
import Toolbar from '@/components/Toolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME } from '@/constants';
import ColumnsMenu from '@/extensions/MultiColumn/menus/ColumnsMenu';
import TableBubbleMenu from '@/extensions/Table/menus/TableBubbleMenu';
import { useLocale } from '@/locales';
import { hasExtension } from '@/utils/utils';

import '../styles/index.scss';

interface IProps {
  content: string;
  extensions: AnyExtension[];
  output: 'html' | 'json' | 'text';

  modelValue?: string | object;
  dark?: boolean;
  dense?: boolean;
  disabled?: boolean;
  label?: string;
  hideToolbar?: boolean;
  disableBubble?: boolean;
  hideBubble?: boolean;
  removeDefaultWrapper?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  editorClass?: string | string[] | Record<string, any>;
  contentClass?: string | string[] | Record<string, any>;
  onChange?: (val: any) => void;
}

function RcTiptapEditor(props: IProps, ref: any) {
  const { content, extensions } = props;
  const { t } = useLocale();

  const sortExtensions = useMemo(() => {
    const diff = differenceBy(extensions, extensions, 'name');
    const exts = extensions.map((k: any) => {
      const find = extensions.find((ext: any) => ext.name === k.name);
      if (!find) {
        return k;
      }
      return k.configure(find.options);
    });
    return [...exts, ...diff].map((k, i) => k.configure({ sort: i }));
  }, [extensions]);

  function getOutput(editor: CoreEditor, output: IProps['output']) {
    // eslint-disable-next-line unicorn/consistent-destructuring
    if (props?.removeDefaultWrapper) {
      if (output === 'html') {
        return editor.isEmpty ? '' : editor.getHTML();
      }
      if (output === 'json') {
        return editor.isEmpty ? {} : editor.getJSON();
      }
      if (output === 'text') {
        return editor.isEmpty ? '' : editor.getText();
      }
      return '';
    }

    if (output === 'html') {
      return editor.getHTML();
    }
    if (output === 'json') {
      return editor.getJSON();
    }
    if (output === 'text') {
      return editor.getText();
    }
    return '';
  }

  const onValueChange = throttle((editor) => {
    const output = getOutput(editor, props.output as any);

    props?.onChange?.(output as any);
  }, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME);

  const editor = useEditor({
    extensions: sortExtensions,
    content,
    onUpdate: ({ editor }) => {
      onValueChange(editor);
    },
  });

  useImperativeHandle(ref, () => {
    return {
      editor,
    };
  });

  useEffect(() => {
    return () => {
      editor?.destroy?.();
    };
  }, []);

  const hasExtensionValue = hasExtension(editor as any, 'characterCount');

  if (!editor) {
    return <></>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className='rc-tiptap-editor rounded-[0.5rem] bg-background shadow overflow-hidden outline outline-1'>
        <ColumnsMenu editor={editor} />
        <TableBubbleMenu editor={editor} />

        <ContentMenu editor={editor} />

        <LinkBubbleMenu editor={editor} />
        {/* {!props?.hideBubble && (
          <BubbleMenu editor={editor as any} disabled={props?.disableBubble} />
        )} */}

        <div className='flex flex-col w-full max-h-full'>
          <Toolbar editor={editor} />
          <EditorContent className={`relative ${props?.contentClass || ''}`} editor={editor} />
          <div className='flex justify-between border-t p-3 items-center'>
            {hasExtensionValue && (
              <div className='flex flex-col'>
                <div className='flex justify-end gap-3 text-sm'>
                  <span>
                    {(editor as any).storage.characterCount.characters()} {t('editor.characters')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default forwardRef(RcTiptapEditor);