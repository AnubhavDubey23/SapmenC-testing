import React, { useState } from 'react';
import {
  ButtonProps,
  ButtonPropsDefaults,
  ButtonPropsSchema,
} from '@usewaypoint/block-button';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import ColorInput from './helpers/inputs/ColorInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import OptionSelectorInput from './helpers/inputs/OptionsSelectorInput';

type ButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};

const WIDTH_OPTIONS = [
  {
    value: 'FULL_WIDTH',
    segment: 'Full',
  },
  {
    value: 'AUTO',
    segment: 'Auto',
  },
];

const SIZE_OPTIONS = [
  {
    value: 'x-small',
    segment: 'Xs',
  },
  {
    value: 'small',
    segment: 'Sm',
  },
  {
    value: 'medium',
    segment: 'Md',
  },
  {
    value: 'large',
    segment: 'Lg',
  },
];

const STYLE_OPTIONS = [
  {
    value: 'rectangle',
    segment: 'Rectangle',
  },
  {
    value: 'rounded',
    segment: 'Rounded',
  },
  {
    value: 'pill',
    segment: 'Pill',
  },
];

export default function ButtonSidebarPanel({
  data,
  setData,
}: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? ButtonPropsDefaults.text;
  const url = data.props?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const buttonStyle =
    data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle;
  const buttonTextColor =
    data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor =
    data.props?.buttonBackgroundColor ??
    ButtonPropsDefaults.buttonBackgroundColor;

  return (
    <BaseSidebarPanel title="Button block">
      <TextInput
        segment="Text"
        defaultValue={text}
        onChange={(text) =>
          updateData({ ...data, props: { ...data.props, text } })
        }
      />
      <TextInput
        segment="Url"
        defaultValue={url}
        onChange={(url) =>
          updateData({ ...data, props: { ...data.props, url } })
        }
      />

      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Width
      </Text>
      <OptionSelectorInput
        options={WIDTH_OPTIONS}
        defaultValue={fullWidth ? 'FULL_WIDTH' : 'AUTO'}
        onChange={(v) =>
          updateData({
            ...data,
            props: { ...data.props, fullWidth: v === 'FULL_WIDTH' },
          })
        }
      />

      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Size
      </Text>
      <OptionSelectorInput
        options={SIZE_OPTIONS}
        defaultValue={size}
        onChange={(size) =>
          updateData({ ...data, props: { ...data.props, size } })
        }
      />

      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        Style
      </Text>
      <OptionSelectorInput
        options={STYLE_OPTIONS}
        defaultValue={buttonStyle}
        onChange={(buttonStyle) =>
          updateData({ ...data, props: { ...data.props, buttonStyle } })
        }
      />

      <ColorInput
        segment="Text color"
        defaultValue={buttonTextColor}
        onChange={(buttonTextColor) =>
          updateData({ ...data, props: { ...data.props, buttonTextColor } })
        }
      />
      <ColorInput
        segment="Button color"
        defaultValue={buttonBackgroundColor}
        onChange={(buttonBackgroundColor) =>
          updateData({
            ...data,
            props: { ...data.props, buttonBackgroundColor },
          })
        }
      />
      <MultiStylePropertyPanel
        names={[
          'backgroundColor',
          'fontFamily',
          'fontSize',
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
