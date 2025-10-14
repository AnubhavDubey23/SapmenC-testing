import React from 'react';

import BaseColorInput from './BaseColorInput';

type Props = {
  segment: string;
  onChange: (value: string) => void;
  defaultValue: string;
};
export default function ColorInput(props: Props) {
  return <BaseColorInput {...props} nullable={false} />;
}

type NullableProps = {
  segment: string;
  onChange: (value: null | string) => void;
  defaultValue: null | string;
};
export function NullableColorInput(props: NullableProps) {
  return <BaseColorInput {...props} nullable />;
}
