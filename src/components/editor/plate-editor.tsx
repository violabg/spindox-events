'use client';

import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '../ui/fixed-toolbar';
import { MarkToolbarButton } from '../ui/mark-toolbar-button';
import { BasicMarksKit } from './plugins/basic-marks-kit';

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [...BasicMarksKit],
    value,
  });

  return (
    <Plate editor={editor}>
      <FixedToolbar className="justify-start rounded-t-lg">
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
      </FixedToolbar>
      <EditorContainer>
        <Editor variant="demo" placeholder="Type..." />
      </EditorContainer>
    </Plate>
  );
}

const value = normalizeNodeId([]);
