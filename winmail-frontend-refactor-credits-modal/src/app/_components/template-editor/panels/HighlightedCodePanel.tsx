import React, { useEffect, useState } from 'react';
import { html, json } from './Highlighters';
import { Box } from '@chakra-ui/react';

type TextEditorPanelProps = {
  type: 'json' | 'html' | 'javascript';
  value: string;
};
export default function HighlightedCodePanel({
  type,
  value,
}: TextEditorPanelProps) {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    switch (type) {
      case 'html':
        html(value).then(setCode);
        return;
      case 'json':
        json(value).then(setCode);
        return;
    }
  }, [setCode, value, type]);

  if (code === null) {
    return null;
  }

  return (
    <Box w="80%" mx="auto" lineHeight={8}>
      <Box
        cursor={'copy'}
        w="100%"
        dangerouslySetInnerHTML={{ __html: code }}
        onClick={(ev) => {
          const s = window.getSelection();
          if (s === null) {
            return;
          }
          s.selectAllChildren(ev.currentTarget);
        }}
      />
    </Box>
  );
}
