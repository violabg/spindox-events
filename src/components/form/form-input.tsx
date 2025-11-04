import { ReactNode, InputHTMLAttributes } from 'react';
import * as React from 'react';
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
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ControllerRenderParams<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
}

interface FieldBaseProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  disableFieldError?: boolean;
  children: (params: ControllerRenderParams<T>) => ReactNode;
}

export function FieldBase<T extends FieldValues>({ control, name, label, description, disableFieldError = false, children }: FieldBaseProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <Field>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            {children({ field, fieldState, formState })}
            {description && <FieldDescription>{description}</FieldDescription>}
            {!disableFieldError && fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}

interface FieldInputProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  maxLength?: number;
  disableFieldError?: boolean;
}

export function FieldInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxLength,
  disableFieldError = false,
  ...inputProps
}: FieldInputProps<T>) {
  const fieldWatcher = useWatch({
    control: control,
    name: name,
    disabled: !maxLength,
  });

  return (
    <FieldBase control={control} name={name} label={label} description={description} disableFieldError={disableFieldError}>
      {({ field }) => (
        <div className="relative">
          <Input id={field.name} {...field} {...inputProps} className={`${maxLength ? 'pr-16' : ''} ${inputProps.className || ''}`} />
          {maxLength && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              {(fieldWatcher || '').length}/{maxLength}
            </div>
          )}
        </div>
      )}
    </FieldBase>
  );
}

interface FieldTextareaProps<T extends FieldValues> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'id'> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  maxLength?: number;
  disableFieldError?: boolean;
}

export function FieldTextarea<T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxLength,
  disableFieldError = false,
  ...textareaProps
}: FieldTextareaProps<T>) {
  const fieldWatcher = useWatch({
    control: control,
    name: name,
    disabled: !maxLength,
  });

  return (
    <FieldBase control={control} name={name} label={label} description={description} disableFieldError={disableFieldError}>
      {({ field }) => (
        <div className="relative">
          <Textarea id={field.name} {...field} {...textareaProps} className={`${maxLength ? 'pr-16' : ''} ${textareaProps.className || ''}`} />
          {maxLength && (
            <div className="absolute right-3 top-3 text-xs text-muted-foreground pointer-events-none bg-background/80 px-1 rounded">
              {(fieldWatcher || '').length}/{maxLength}
            </div>
          )}
        </div>
      )}
    </FieldBase>
  );
}
