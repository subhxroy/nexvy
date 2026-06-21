import React, { forwardRef } from 'react';
import { View, TextInput as RNTextInput, Text, Platform } from 'react-native';
import { useController, Control, FieldValues, Path } from 'react-hook-form';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TextInputProps<TFieldValues extends FieldValues = FieldValues> {
  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url' | 'number-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  returnKeyType?: 'next' | 'done' | 'go' | 'search';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

export const TextInput = forwardRef(function TextInput<TFieldValues extends FieldValues = FieldValues>(
  {
    name,
    control,
    placeholder,
    label,
    error,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
    multiline = false,
    className = '',
    value,
    onChangeText,
    returnKeyType,
    onSubmitEditing,
    blurOnSubmit,
  }: TextInputProps<TFieldValues>,
  ref: React.Ref<RNTextInput>
) {
  if (control && name) {
    return (
      <ControlledTextInput
        ref={ref}
        name={name}
        control={control}
        placeholder={placeholder}
        label={label}
        error={error}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        className={className}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
      />
    );
  }

  return (
    <UncontrolledTextInput
      ref={ref}
      value={value ?? ''}
      onChangeText={onChangeText}
      placeholder={placeholder}
      label={label}
      error={error}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      className={className}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      blurOnSubmit={blurOnSubmit}
    />
  );
}) as <TFieldValues extends FieldValues = FieldValues>(
  props: TextInputProps<TFieldValues> & { ref?: React.Ref<RNTextInput> }
) => React.ReactElement;

const UncontrolledTextInput = forwardRef<RNTextInput, {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  className?: string;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}>(function UncontrolledTextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  multiline,
  className,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}, ref) {
  return (
    <View className={className}>
      {label && <Text className="text-text-secondary text-body-sm mb-2">{label}</Text>}
      <RNTextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#525252"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        className={`
          h-11 bg-surface rounded-[10px] px-4 text-text-secondary text-body
          ${multiline ? 'h-24 py-3' : ''}
        `}
      />
      {error && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
              fontSize: 12,
              color: '#DC2626',
            }}
            className="mt-1"
          >
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});

const ControlledTextInput = forwardRef<RNTextInput, {
  name: Path<FieldValues>;
  control: Control<FieldValues>;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  className?: string;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}>(function ControlledTextInput({
  name,
  control,
  placeholder,
  label,
  error,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  multiline,
  className,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}, ref) {
  const { field, fieldState } = useController({ name, control });
  const displayError = error ?? fieldState.error?.message;
  const isNumeric = keyboardType === 'numeric';

  return (
    <View className={className}>
      {label && <Text className="text-text-secondary text-body-sm mb-2">{label}</Text>}
      <RNTextInput
        ref={ref}
        value={isNumeric ? (field.value !== undefined && field.value !== null ? String(field.value) : '') : field.value ?? ''}
        onChangeText={(text) => {
          field.onChange(isNumeric ? (text ? Number(text) : undefined) : text);
        }}
        onBlur={field.onBlur}
        placeholder={placeholder}
        placeholderTextColor="#525252"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        className={`
          h-11 bg-surface rounded-[10px] px-4 text-text-secondary text-body
          ${multiline ? 'h-24 py-3' : ''}
          ${displayError ? 'border border-[#DC2626]' : ''}
        `}
      />
      {displayError && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Text
            style={{
              fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
              fontSize: 12,
              color: '#DC2626',
            }}
            className="mt-1"
          >
            {displayError}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});


