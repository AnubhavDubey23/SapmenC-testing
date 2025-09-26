import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  Box,
} from '@chakra-ui/react';

interface Option {
  value: string;
  segment: string | React.ReactElement;
  content?: React.ReactNode;
}

interface OptionSelectorProps {
  options: Option[];
  defaultValue: string;
  onChange: (value: string) => void;
  variant?: 'tabs' | 'radio';
}

const OptionSelectorInput: React.FC<OptionSelectorProps> = ({
  options,
  defaultValue,
  onChange,
  variant = 'tabs',
}) => {
  const [selectedValue, setSelectedValue] =
    React.useState<string>(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  const rendersegment = (segment: string | React.ReactElement) => {
    if (typeof segment === 'string') {
      return segment;
    }
    return (
      <Box as="span" display="flex" alignItems="center" justifyContent="center">
        {segment}
      </Box>
    );
  };

  if (variant === 'tabs') {
    return (
      <Tabs
        onChange={(index) => handleChange(options[index].value)}
        defaultIndex={options.findIndex((opt) => opt.value === defaultValue)}
        width="100%"
      >
        <TabList p={2}>
          {options.map((option) => (
            <Tab key={option.value} fontWeight="bold" flex={1}>
              {rendersegment(option.segment)}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {options.map((option) => (
            <TabPanel key={option.value}>{option.content}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    );
  }

  return (
    <RadioGroup value={selectedValue} onChange={handleChange}>
      <Stack direction="row" width="100%" justifyContent="space-between">
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {rendersegment(option.segment)}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default OptionSelectorInput;
