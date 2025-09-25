import React, { useState } from 'react';
import {
  HeadingProps,
  HeadingPropsDefaults,
  HeadingPropsSchema,
} from '@usewaypoint/block-heading';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import OptionSelectorInput from './helpers/inputs/OptionsSelectorInput';

type HeadingSidebarPanelProps = {
  data: HeadingProps;
  setData: (v: HeadingProps) => void;
};

const HEADING_OPTIONS = [
  { value: 'h1', segment: 'H1' },
  { value: 'h2', segment: 'H2' },
  { value: 'h3', segment: 'H3' },
];

export default function HeadingSidebarPanel({
  data,
  setData,
}: HeadingSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = HeadingPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Heading block">
      <TextInput
        segment="Content"
        rows={3}
        defaultValue={data.props?.text ?? HeadingPropsDefaults.text}
        onChange={(text) => {
          updateData({ ...data, props: { ...data.props, text } });
        }}
      />

      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Level
      </Text>
      <OptionSelectorInput
        options={HEADING_OPTIONS}
        defaultValue={data.props?.level ?? HeadingPropsDefaults.level}
        onChange={(level) => {
          updateData({ ...data, props: { ...data.props, level } });
        }}
        variant="tabs"
      />
      <MultiStylePropertyPanel
        names={[
          'color',
          'backgroundColor',
          'fontFamily',
          'fontWeight',
          'textAlign',
          'padding',
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
