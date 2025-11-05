'use client';

import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { FixedToolbarKit } from './plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from './plugins/floating-toolbar-kit';

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [...BasicMarksKit, ...FixedToolbarKit, ...FloatingToolbarKit],
    value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="demo" placeholder="Type..." />
      </EditorContainer>
    </Plate>
  );
}

const value = normalizeNodeId([]);
