'use client';

import * as React from 'react';
import { InputHTMLAttributes, ReactNode } from 'react';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormStateReturn,
  useWatch,
} from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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

interface FieldSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disableFieldError?: boolean;
}

export function FieldSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  disableFieldError = false,
}: FieldSelectProps<T>) {
  return (
    <FieldBase control={control} name={name} label={label} description={description} disableFieldError={disableFieldError}>
      {({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldBase>
  );
}

interface FieldCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}

export function FieldCheckbox<T extends FieldValues>({ control, name, label }: FieldCheckboxProps<T>) {
  const fieldWatcher = useWatch({
    control: control,
    name: name,
  });

  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Checkbox id={field.name} checked={fieldWatcher} onCheckedChange={field.onChange} />
            <Label htmlFor={field.name} className="cursor-pointer font-normal">
              {label}
            </Label>
          </>
        )}
      />
    </div>
  );
}
