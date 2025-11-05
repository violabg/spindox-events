import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import { createPlateEditor } from 'platejs/react';

const editor = createPlateEditor({
  plugins: [...BasicMarksKit],
});
