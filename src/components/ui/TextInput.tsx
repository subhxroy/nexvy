import { View, TextInput as RNTextInput, Text } from 'react-native';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

interface TextInputProps<TFieldValues extends FieldValues = FieldValues> {
  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'url';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function TextInput<TFieldValues extends FieldValues = FieldValues>({
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
}: TextInputProps<TFieldValues>) {
  if (control && name) {
    return (
      <ControlledTextInput
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
      />
    );
  }

  return (
    <UncontrolledTextInput
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
    />
  );
}

function UncontrolledTextInput({
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
}: {
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
}) {
  return (
    <View className={className}>
      {label && <Text className="text-ash text-body-sm mb-2">{label}</Text>}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#797979"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        className={`
          h-11 bg-[#212121] rounded-xl px-4 text-ash text-body
          ${multiline ? 'h-24 py-3' : ''}
        `}
      />
      {error && <Text className="text-error text-caption mt-1">{error}</Text>}
    </View>
  );
}

function ControlledTextInput<TFieldValues extends FieldValues>({
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
}: {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  placeholder?: string;
  label?: string;
  error?: string;
  keyboardType?: TextInputProps<TFieldValues>['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps<TFieldValues>['autoCapitalize'];
  multiline?: boolean;
  className?: string;
}) {
  const { field, fieldState } = useController({ name, control });
  const displayError = error ?? fieldState.error?.message;

  return (
    <View className={className}>
      {label && <Text className="text-ash text-body-sm mb-2">{label}</Text>}
      <RNTextInput
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        placeholderTextColor="#797979"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        className={`
          h-11 bg-[#212121] rounded-xl px-4 text-ash text-body
          ${multiline ? 'h-24 py-3' : ''}
          ${displayError ? 'border border-error' : ''}
        `}
      />
      {displayError && (
        <Text className="text-error text-caption mt-1">{displayError}</Text>
      )}
    </View>
  );
}
