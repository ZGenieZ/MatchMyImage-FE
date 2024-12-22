import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useArgs } from '@storybook/core/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonProps } from './Button';

const meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    onPress: { action: 'pressed the button' },
    type: {
      control: false,
    },
    disabled: {
      control: 'boolean',
      description: '버튼의 비활성화 여부를 선택합니다.',
    },
    isSelected: {
      control: false,
    },
  },
  decorators: [
    Story => {
      return (
        <View style={styles.container}>
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>Buttons</Text>
            <Text style={styles.storySubTitle}>
              사용자로 하여금 특정한 행동을 유도합니다.{'\n'}버튼은 위계에 따라 3타입으로 나뉘며, 영역에 따라 2~3가지의
              크기로 나뉘게 됩니다.
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={{ alignItems: 'flex-start' }}>
            <Story />
          </View>
        </View>
      );
    },
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const handleRender = (args: ButtonProps) => {
  const [{ isSelected, disabled }, updateArgs] = useArgs();
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || typeof args.onPress !== 'function') return;
    updateArgs({ isSelected: !isSelected });
    args.onPress(e);
  };

  return <Button {...args} onPress={handlePress} />;
};

export const Primary = {
  name: 'Primary',
  args: {
    text: 'Primary',
    type: 'Primary',
    disabled: false,
    isSelected: false,
  },
  render: handleRender,
};

export const Secondary = {
  name: 'Secondary',
  args: {
    text: 'Secondary',
    type: 'Secondary',
    disabled: false,
    isSelected: false,
  },
  render: handleRender,
};

export const Teritary = {
  name: 'Teritary',
  args: {
    text: 'Teritary',
    type: 'Teritary',
    disabled: false,
    isSelected: false,
  },
  render: handleRender,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  storyContainer: {
    gap: 8,
  },
  storyTitle: { fontSize: 30, fontWeight: 'bold' },
  storySubTitle: { fontSize: 10 },
  divider: { marginVertical: 20 },
});
