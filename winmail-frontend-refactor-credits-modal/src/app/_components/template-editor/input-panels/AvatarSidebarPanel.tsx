import React, { useState } from 'react';

// import { AspectRatioOutlined } from '@mui/icons-material';
// import { ToggleButton } from '@mui/material';
import {
  AvatarProps,
  AvatarPropsDefaults,
  AvatarPropsSchema,
} from '@usewaypoint/block-avatar';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
// import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import SliderInput from './helpers/inputs/SliderInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import { MdAspectRatio } from 'react-icons/md';
import { Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

type AvatarSidebarPanelProps = {
  data: AvatarProps;
  setData: (v: AvatarProps) => void;
};
export default function AvatarSidebarPanel({
  data,
  setData,
}: AvatarSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = AvatarPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const size = data.props?.size ?? AvatarPropsDefaults.size;
  const imageUrl = data.props?.imageUrl ?? AvatarPropsDefaults.imageUrl;
  const alt = data.props?.alt ?? AvatarPropsDefaults.alt;
  const shape = data.props?.shape ?? AvatarPropsDefaults.shape;

  return (
    <BaseSidebarPanel title="Avatar block">
      <SliderInput
        segment="Size"
        iconsegment={<MdAspectRatio />}
        units="px"
        step={3}
        min={32}
        max={256}
        defaultValue={size}
        onChange={(size) => {
          updateData({ ...data, props: { ...data.props, size } });
        }}
      />
      {/* <RadioGroupInput
        segment="Shape"
        defaultValue={shape}
        onChange={(shape) => {
          updateData({ ...data, props: { ...data.props, shape } });
        }}
      >
        <ToggleButton value="circle">Circle</ToggleButton>
        <ToggleButton value="square">Square</ToggleButton>
        <ToggleButton value="rounded">Rounded</ToggleButton>
      </RadioGroupInput> */}
      {
        <Box>
          <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={0}>
            Shape
          </Text>
          <RadioGroup
            defaultValue={shape}
            onChange={(shape) => {
              updateData({ ...data, props: { ...data.props, shape } });
            }}
          >
            <Stack spacing={4} direction="row">
              <Radio value="circle" isDisabled>
                Circle
              </Radio>
              <Radio value="square">Square</Radio>
              <Radio value="rounded">Rounded</Radio>
            </Stack>
          </RadioGroup>
        </Box>
      }
      <TextInput
        segment="Image URL"
        defaultValue={imageUrl}
        onChange={(imageUrl) => {
          updateData({ ...data, props: { ...data.props, imageUrl } });
        }}
      />
      <TextInput
        segment="Alt text"
        defaultValue={alt}
        onChange={(alt) => {
          updateData({ ...data, props: { ...data.props, alt } });
        }}
      />

      <MultiStylePropertyPanel
        names={['textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
