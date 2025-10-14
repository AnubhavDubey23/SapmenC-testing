import React, { useState } from 'react';

// import {
//   VerticalAlignBottomOutlined,
//   VerticalAlignCenterOutlined,
//   VerticalAlignTopOutlined,
// } from '@mui/icons-material';
// import { Stack, ToggleButton } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
// import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import {
  MdVerticalAlignBottom,
  MdVerticalAlignCenter,
  MdVerticalAlignTop,
} from 'react-icons/md';
import OptionSelectorInput from './helpers/inputs/OptionsSelectorInput';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};

const ALIGN_OPTIONS = [
  {
    value: 'top',
    segment: <MdVerticalAlignTop fontSize="small" />,
  },
  {
    value: 'middle',
    segment: <MdVerticalAlignCenter fontSize="small" />,
  },
  {
    value: 'bottom',
    segment: <MdVerticalAlignBottom fontSize="small" />,
  },
];

export default function ImageSidebarPanel({
  data,
  setData,
}: ImageSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Image block">
      <TextInput
        segment="Source URL"
        defaultValue={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />

      <TextInput
        segment="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) =>
          updateData({ ...data, props: { ...data.props, alt } })
        }
      />
      <TextInput
        segment="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          segment="Width"
          defaultValue={data.props?.width}
          onChange={(width) =>
            updateData({ ...data, props: { ...data.props, width } })
          }
        />
        <TextDimensionInput
          segment="Height"
          defaultValue={data.props?.height}
          onChange={(height) =>
            updateData({ ...data, props: { ...data.props, height } })
          }
        />
      </Stack>

      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Alignment
      </Text>
      <OptionSelectorInput
        options={ALIGN_OPTIONS}
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) =>
          updateData({ ...data, props: { ...data.props, contentAlignment } })
        }
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
