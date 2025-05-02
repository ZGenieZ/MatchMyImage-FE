import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useFormContext } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { HelperText } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import Popover from 'react-native-popover-view';

import type { RootStackParamList } from 'types/shared';
import { theme } from 'styles/theme';
import { isAos } from 'utils/device';
import { QuestionCircle } from 'components/common/icons/QuestionCircle';
import { useValidNickname } from 'hooks/queries/member/useValidNickname';
import { StatusCodeEnum } from 'schemes/shared/enum';
import type { signUpRequestSchemeType } from 'types/member/scheme/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SIGN_UP_USER_INFO'>;

const UserInfo = ({ navigation: { navigate } }: Props) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields, touchedFields },
    setError,
    clearErrors,
  } = useFormContext<signUpRequestSchemeType>();

  const {
    mutate: mutateValidNickname,
    isSuccess: isSuccessMutateValidNickname,
    reset: resetMutateValidNickname,
  } = useValidNickname();

  const { top, bottom } = useSafeAreaInsets();
  const heightStyle = useMemo(
    () => ({
      height: isAos
        ? Dimensions.get('screen').height
        : Dimensions.get('screen').height - getStatusBarHeight() - top - bottom,
    }),
    [top, bottom],
  );

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const nickname = watch('nickname');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');

  const isButtonDisabled = useMemo(() => !(nickname && dateOfBirth && gender), [nickname, dateOfBirth, gender]);

  const toggleDatePicker = useCallback((isOpen: boolean) => () => setDatePickerOpen(isOpen), []);

  const handleDateChange = useCallback(
    (date: Date) => {
      setValue('dateOfBirth', dayjs(date).format('YYYY / MM / DD'));
      setDatePickerOpen(false);
    },
    [setValue, toggleDatePicker],
  );

  const handleGenderButton = useCallback(
    (value: 'MALE' | 'FEMALE') => () => {
      setValue('gender', value);
    },
    [],
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, heightStyle]}>
      <View style={styles.inputSection}>
        <View>
          <Text style={styles.titleBold}>반가워요!</Text>
          <Text style={styles.titleNormal}>사용자 정보를 입력해주세요</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.labelWrap}>
            <Text
              style={[
                styles.label,
                errors.nickname && styles.error,
                !errors.nickname && touchedFields.nickname && isSuccessMutateValidNickname && styles.valid,
              ]}
            >
              닉네임
            </Text>
            <Popover
              from={
                <Pressable>
                  <QuestionCircle />
                </Pressable>
              }
              backgroundStyle={styles.popoverBackground}
              offset={4}
              popoverStyle={styles.popoverStyle}
            >
              <Text style={styles.popoverTitle}>{'닉네임은 회원가입 이후 \n내 정보에서 변경할 수 있습니다.'}</Text>
            </Popover>
          </View>
          <Controller
            name="nickname"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    errors.nickname && styles.errorBorder,
                    !errors.nickname && touchedFields.nickname && isSuccessMutateValidNickname && styles.validBorder,
                  ]}
                  placeholder="닉네임을 입력해주세요"
                  onChangeText={onChange}
                  onBlur={() => {
                    onBlur();
                    resetMutateValidNickname();

                    if (!dirtyFields.nickname) {
                      return;
                    }

                    if (nickname.length < 2 || nickname.length > 7) {
                      setError('nickname', { type: 'nickname', message: '* 닉네임 길이 조건을 확인해주세요.' });
                      return;
                    }

                    if (nickname.match(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9/]/)) {
                      setError('nickname', { type: 'nickname', message: '* 띄워쓰기, 특수문자는 사용할 수 없어요.' });
                      return;
                    }

                    mutateValidNickname(
                      { nickname },
                      {
                        onSuccess: ({ statusCode, data }) => {
                          if (statusCode !== StatusCodeEnum.enum.S100) {
                            setError('nickname', { type: 'nickname', message: `* ${data}.` });
                            return;
                          }

                          clearErrors('nickname');
                        },
                        onError: e => {
                          Alert.alert('닉네임 중복 여부 검증에 실패했습니다.');
                          console.error(e.response?.data);
                        },
                      },
                    );
                  }}
                  value={value}
                />
              </>
            )}
          />
          {errors.nickname ? (
            <HelperText type="error" padding="none" style={[styles.message, styles.error]}>
              {errors.nickname.message as string}
            </HelperText>
          ) : (
            <HelperText
              type="info"
              padding="none"
              style={[
                styles.message,
                touchedFields.nickname && isSuccessMutateValidNickname ? styles.valid : styles.default,
              ]}
            >
              {touchedFields.nickname && isSuccessMutateValidNickname
                ? '사용 가능한 닉네임이에요.'
                : '* 최소 2자 ~ 최대 7글자 입력 가능합니다.'}
            </HelperText>
          )}
        </View>
        <View style={styles.formContainer}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field: { value, onBlur } }) => (
              <>
                <Text style={[styles.label, errors.dateOfBirth && styles.error]}>생년월일</Text>
                <Pressable onPress={toggleDatePicker(true)}>
                  <TextInput
                    style={[styles.input, errors.dateOfBirth && styles.error]}
                    pointerEvents="none"
                    editable={false}
                    placeholder="YYYY / MM / DD"
                    value={value}
                  />
                </Pressable>
                <HelperText type="info" padding="none" style={[styles.message, styles.default]}>
                  * 14세 미만은 가입대상이 아닙니다.
                </HelperText>
                <DatePicker
                  modal
                  open={datePickerOpen}
                  mode="date"
                  date={dayjs().toDate()}
                  maximumDate={dayjs().subtract(14, 'year').toDate()}
                  onConfirm={date => {
                    onBlur();
                    handleDateChange(date);
                  }}
                  onCancel={toggleDatePicker(false)}
                />
              </>
            )}
          />
        </View>
        <View style={styles.genderButtonContainer}>
          <Pressable
            style={[styles.genderButton, gender === 'MALE' && { borderColor: theme.COLORS.DEFAULT.BLACK }]}
            onPress={handleGenderButton('MALE')}
          >
            <Text style={styles.genderButtonText}>남성</Text>
          </Pressable>
          <Pressable
            style={[styles.genderButton, gender === 'FEMALE' && { borderColor: theme.COLORS.DEFAULT.BLACK }]}
            onPress={handleGenderButton('FEMALE')}
          >
            <Text style={styles.genderButtonText}>여성</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        style={[styles.nextButton, !isButtonDisabled && { backgroundColor: theme.COLORS.PRIMARY.RED_500 }]}
        disabled={isButtonDisabled}
        onPress={() => {
          navigate('SIGN_UP_AGREEMENT');
        }}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  inputSection: {
    gap: 40,
  },
  labelWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  popoverStyle: { backgroundColor: theme.COLORS.DEFAULT.BLACK, paddingVertical: 12, paddingHorizontal: 8 },
  popoverBackground: { opacity: 0 },
  popoverTitle: { color: theme.COLORS.DEFAULT.WHITE, textAlign: 'center' },
  default: {
    color: theme.COLORS.GRAY_SCALE.GRAY_600,
  },
  message: {
    paddingVertical: 0,
    fontSize: 12,
  },
  titleBold: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleNormal: {
    fontSize: 28,
    alignItems: 'center',
  },
  formContainer: {
    gap: 12,
  },
  label: {
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: theme.COLORS.GRAY_SCALE.GRAY_400,
    paddingHorizontal: 16,
    color: theme.COLORS.DEFAULT.BLACK,
  },
  valid: {
    color: theme.COLORS.SECONDARY.BLUE_500,
  },
  error: {
    color: theme.COLORS.PRIMARY.RED_500,
  },
  validBorder: {
    borderColor: theme.COLORS.SECONDARY.BLUE_500,
  },
  errorBorder: {
    borderColor: theme.COLORS.PRIMARY.RED_500,
  },
  selectBox: {
    width: Dimensions.get('window').width / 2 - 24,
    borderColor: theme.COLORS.GRAY_SCALE.GRAY_400,
  },
  genderButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    borderWidth: 1,
    borderColor: theme.COLORS.GRAY_SCALE.GRAY_500,
  },
  genderButtonText: {
    fontSize: 16,
    color: theme.COLORS.DEFAULT.BLACK,
  },
  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 56,
    backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_500,
  },
  nextButtonText: {
    fontSize: 18,
    color: theme.COLORS.DEFAULT.WHITE,
  },
});

export { UserInfo };
