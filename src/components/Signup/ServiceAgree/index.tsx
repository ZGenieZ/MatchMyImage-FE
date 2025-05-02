import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Checkbox, Divider } from 'react-native-paper';

import type { signUpRequestSchemeType } from 'types/member/scheme/api';
import { theme } from 'styles/theme';
import { useSignUp } from 'hooks/queries/member/useSignUp';

type AgreementKeys = keyof signUpRequestSchemeType['agreements'];
type AgreementLabels = `agreements.${AgreementKeys}`;

const CHECKBOX_MAP_LIST: { label: AgreementLabels; text: string; isLinkable: boolean }[] = [
  { label: 'agreements.termsOfAgree', text: '(필수) 서비스 이용약관 관련 동의', isLinkable: true },
  { label: 'agreements.privacy', text: '(필수) 개인정보 처리 방침', isLinkable: true },
  { label: 'agreements.advertisement', text: '(선택) 광고성 정보 수신동의', isLinkable: true },
];

const ServiceAgree = () => {
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [ageOfAgree, setAgeOfAgree] = useState<boolean>(false);
  const { handleSubmit, control, watch, setValue } = useFormContext<signUpRequestSchemeType>();
  const serviceAgree = watch('agreements.termsOfAgree');
  const privateAgree = watch('agreements.privacy');

  const { mutate } = useSignUp();

  const isButtonDisabled = useMemo(() => {
    if (ageOfAgree && serviceAgree && privateAgree) {
      return false;
    }

    if (allChecked) {
      return false;
    }

    return true;
  }, [ageOfAgree, allChecked, privateAgree, serviceAgree]);

  const onSubmit: SubmitHandler<signUpRequestSchemeType> = useCallback(
    values => {
      console.log(values);
      const { dateOfBirth } = values;
      mutate({
        ...values,
        dateOfBirth: dateOfBirth.replaceAll(' / ', '-'),
      });
    },
    [mutate],
  );

  const onPressCheckBox = useCallback(
    (label: AgreementLabels) => () => {
      if (watch(label)) {
        setValue(label, false);
        return;
      }
      setValue(label, true);
    },
    [setValue, watch],
  );

  const toggleAgeOfAgreeCheckBox = useCallback(() => {
    setAgeOfAgree(prev => !prev);
  }, []);

  const onPressAllCheckBox = useCallback(() => {
    if (allChecked) {
      setAllChecked(false);
      setAgeOfAgree(false);
      setValue('agreements.termsOfAgree', false);
      setValue('agreements.privacy', false);
      setValue('agreements.advertisement', false);
      return;
    }
    setAllChecked(true);
    setAgeOfAgree(true);
    setValue('agreements.termsOfAgree', true);
    setValue('agreements.privacy', true);
    setValue('agreements.advertisement', true);
  }, [allChecked, setValue]);

  const getCheckboxStatus = useCallback((label: AgreementLabels) => (watch(label) ? 'checked' : 'unchecked'), [watch]);

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <View style={styles.titleWrap}>
          <Text style={styles.titleBold}>이용 약관에 동의해주시면</Text>
          <Text style={styles.titleNormal}>회원가입이 끝나요!</Text>
        </View>
        <Divider style={styles.topDivider} />
        <View style={styles.checkboxWrap}>
          <View style={styles.formRow}>
            <Checkbox.Android
              color={theme.COLORS.PRIMARY.RED_500}
              status={ageOfAgree ? 'checked' : 'unchecked'}
              onPress={toggleAgeOfAgreeCheckBox}
            />
            <Text>(필수) 만 14세 이상입니다.</Text>
          </View>
          {CHECKBOX_MAP_LIST.map(item => (
            <Controller
              key={item.label}
              name={item.label}
              control={control}
              render={() => (
                <View style={styles.formRow}>
                  <Checkbox.Android
                    color={theme.COLORS.PRIMARY.RED_500}
                    status={getCheckboxStatus(item.label)}
                    onPress={onPressCheckBox(item.label)}
                  />
                  <Text>{item.text}</Text>
                </View>
              )}
            />
          ))}
        </View>
        <Divider style={styles.bottomDivider} bold />
        <View style={[styles.formRow, { marginTop: 20 }]}>
          <Checkbox.Android
            color={theme.COLORS.PRIMARY.RED_500}
            status={allChecked ? 'checked' : 'unchecked'}
            onPress={onPressAllCheckBox}
          />
          <Text>모두 동의합니다.</Text>
        </View>
      </View>
      <Pressable
        style={[styles.button, !isButtonDisabled && { backgroundColor: theme.COLORS.PRIMARY.RED_500 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>완료</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
    height:
      Platform.OS === 'android'
        ? Dimensions.get('window').height - getStatusBarHeight()
        : Dimensions.get('window').height - getStatusBarHeight() - 34,
  },
  inputSection: {
    // gap: 40,
  },
  titleWrap: {
    marginBottom: 38,
  },
  titleBold: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleNormal: {
    fontSize: 28,
    alignItems: 'center',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxWrap: {
    gap: 10,
  },
  topDivider: { marginBottom: 20 },
  bottomDivider: { marginTop: 20 },

  button: {
    marginBottom: 32,
    marginHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 56,
    backgroundColor: theme.COLORS.GRAY_SCALE.GRAY_500,
  },
  buttonText: {
    fontSize: 18,
    color: theme.COLORS.DEFAULT.WHITE,
  },
});

export { ServiceAgree };
