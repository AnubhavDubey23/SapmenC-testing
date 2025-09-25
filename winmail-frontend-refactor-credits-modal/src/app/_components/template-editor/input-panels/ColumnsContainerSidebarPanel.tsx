import React, { useState } from 'react';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColumnWidthsInput from './helpers/inputs/ColumnWidthsInput';
import SliderInput from './helpers/inputs/SliderInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import ColumnsContainerPropsSchema, {
  ColumnsContainerProps,
} from '../../documents/blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import {
  MdOutlineVerticalAlignBottom,
  MdOutlineVerticalAlignTop,
  MdSpaceBar,
  MdVerticalAlignCenter,
} from 'react-icons/md';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import OptionSelectorInput from './helpers/inputs/OptionsSelectorInput';

type ColumnsContainerPanelProps = {
  data: ColumnsContainerProps;
  setData: (v: ColumnsContainerProps) => void;
};

const COLUMN_OPTIONS = [
  { value: '2', segment: '2' },
  { value: '3', segment: '3' },
];

const ALIGN_OPTIONS = [
  {
    value: 'top',
    segment: <MdOutlineVerticalAlignTop />,
  },
  {
    value: 'middle',
    segment: <MdVerticalAlignCenter />,
  },
  {
    value: 'bottom',
    segment: <MdOutlineVerticalAlignBottom />,
  },
];

export default function ColumnsContainerPanel({
  data,
  setData,
}: ColumnsContainerPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = ColumnsContainerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Columns block">
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Number of columns
      </Text>
      <OptionSelectorInput
        options={COLUMN_OPTIONS}
        defaultValue={data.props?.columnsCount === 2 ? '2' : '3'}
        onChange={(v) => {
          updateData({
            ...data,
            props: { ...data.props, columnsCount: v === '2' ? 2 : 3 },
          });
        }}
        variant="tabs"
      />
      <ColumnWidthsInput
        defaultValue={data.props?.fixedWidths}
        onChange={(fixedWidths) => {
          updateData({ ...data, props: { ...data.props, fixedWidths } });
        }}
      />
      <SliderInput
        segment="Columns gap"
        iconsegment={<MdSpaceBar />}
        units="px"
        step={4}
        marks
        min={0}
        max={80}
        defaultValue={data.props?.columnsGap ?? 0}
        onChange={(columnsGap) =>
          updateData({ ...data, props: { ...data.props, columnsGap } })
        }
      />

      <OptionSelectorInput
        options={ALIGN_OPTIONS}
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => {
          updateData({ ...data, props: { ...data.props, contentAlignment } });
        }}
      />

      <MultiStylePropertyPanel
        names={['backgroundColor', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
