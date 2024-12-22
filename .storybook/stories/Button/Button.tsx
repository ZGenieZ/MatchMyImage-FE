import { Text, StyleSheet, Pressable, PressableProps } from 'react-native';

import { theme } from 'styles/theme';

type ButtonType = 'Primary' | 'Secondary' | 'Teritary';

export type ButtonProps = PressableProps & {
  type: ButtonType;
  text: string;
  isSelected?: boolean;
};

export const Button = ({ type, text, isSelected = false, disabled, style, ...props }: ButtonProps) => {
  const getButtonStyle = ({
    type,
    isSelected,
    disabled,
  }: {
    type: ButtonType;
    isSelected: boolean;
    disabled: undefined | null | boolean;
  }) => {
    let result = {};

    if (type === 'Primary') {
      result = { backgroundColor: theme.COLORS.PRIMARY.RED_500 };

      if (disabled) {
        result = {
          backgroundColor: theme.COLORS.PRIMARY.RED_100,
        };
      }
    }

    if (type === 'Secondary') {
      result = {
        backgroundColor: theme.COLORS.DEFAULT.WHITE,
        borderWidth: 1.5,
        borderColor: theme.COLORS.GRAY_SCALE.GRAY_500,
      };

      if (isSelected) {
        result = {
          backgroundColor: theme.COLORS.PRIMARY.RED_100,
          borderWidth: 1.5,
          borderColor: theme.COLORS.PRIMARY.RED_500,
        };
      }

      if (disabled) {
        result = {
          backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_300,
          borderWidth: 1.5,
          borderColor: theme.COLORS.GRAY_SCALE.GRAY_400,
        };
      }
    }

    if (type === 'Teritary') {
      result = { backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_300 };

      if (isSelected) {
        result = {
          backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_800,
        };
      }

      if (disabled) {
        result = {
          backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_300,
        };
      }
    }

    return result;
  };

  const getButtonTextStyle = ({
    type,
    isSelected,
    disabled,
  }: {
    type: ButtonType;
    isSelected: boolean;
    disabled: undefined | null | boolean;
  }) => {
    let result = {};

    if (type === 'Primary') {
      result = { color: theme.COLORS.DEFAULT.WHITE };
    }

    if (type === 'Secondary') {
      result = { color: theme.COLORS.DEFAULT.BLACK };

      if (isSelected) {
        result = { color: theme.COLORS.PRIMARY.RED_500 };
      }

      if (disabled) {
        result = { color: theme.COLORS.GRAY_SCALE.GRAY_500 };
      }
    }

    if (type === 'Teritary') {
      result = { color: theme.COLORS.DEFAULT.BLACK };

      if (isSelected) {
        result = { color: theme.COLORS.DEFAULT.WHITE };
      }

      if (disabled) {
        result = { color: theme.COLORS.GRAY_SCALE.GRAY_500 };
      }
    }

    return result;
  };

  return (
    <Pressable style={[styles.container, getButtonStyle({ type, isSelected, disabled }), style]} {...props}>
      <Text style={getButtonTextStyle({ type, isSelected, disabled })}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 312,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 19,
    borderRadius: 8,
  },
  text: { color: 'white' },
});
