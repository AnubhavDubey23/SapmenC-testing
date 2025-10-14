import React from 'react';
import { NullableColorInput } from '../inputs/ColorInput';
import { NullableFontFamily } from '../inputs/FontFamily';
import FontSizeInput from '../inputs/FontSizeInput';
import FontWeightInput from '../inputs/FontWeightInput';
import PaddingInput from '../inputs/PaddingInput';
import SliderInput from '../inputs/SliderInput';
import TextAlignInput from '../inputs/TextAlignInput';
import { TStyle } from '@/app/_components/documents/blocks/helpers/TStyle';
import { MdRoundedCorner } from 'react-icons/md';

type StylePropertyPanelProps = {
  name: keyof TStyle;
  value: TStyle;
  onChange: (style: TStyle) => void;
};
export default function SingleStylePropertyPanel({
  name,
  value,
  onChange,
}: StylePropertyPanelProps) {
  const defaultValue = value[name] ?? null;
  const handleChange = (v: any) => {
    onChange({ ...value, [name]: v });
  };

  switch (name) {
    case 'backgroundColor':
      return (
        <NullableColorInput
          segment="Background color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'borderColor':
      return (
        <NullableColorInput
          segment="Border color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'borderRadius':
      return (
        <SliderInput
          iconsegment={<MdRoundedCorner />}
          units="px"
          step={4}
          marks
          min={0}
          max={48}
          segment="Border radius"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'color':
      return (
        <NullableColorInput
          segment="Text color"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'fontFamily':
      return (
        <NullableFontFamily
          segment="Font family"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'fontSize':
      return (
        <FontSizeInput
          segment="Font size"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'fontWeight':
      return (
        <FontWeightInput
          segment="Font weight"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'textAlign':
      return (
        <TextAlignInput
          segment="Alignment"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
    case 'padding':
      return (
        <PaddingInput
          segment="Padding"
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      );
  }
}
