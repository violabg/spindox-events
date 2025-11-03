import { ReactNode } from 'react';
import {
  Control,
  Controller,
  useWatch,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface ControllerRenderParams<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  maxLength?: number;
  disableFieldError?: boolean;
  children: (params: ControllerRenderParams<T>) => ReactNode;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxLength,
  disableFieldError = false,
  children,
}: FormInputProps<T>) {
  const fieldWatcher = useWatch({
    control: control,
    name: name,
    disabled: !maxLength,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <Field>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            {children({ field, fieldState, formState })}
            {(description || maxLength) && (
              <div className="flex items-center justify-between">
                {description && <FieldDescription>{description}</FieldDescription>}
                {maxLength && (
                  <span className="text-xs text-muted-foreground">
                    {(fieldWatcher || '').length}/{maxLength}
                  </span>
                )}
              </div>
            )}
            {!disableFieldError && fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
