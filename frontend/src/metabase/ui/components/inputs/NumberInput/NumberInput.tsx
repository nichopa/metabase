import type {
  TextInputProps,
  NumberInputProps as _NumberInputProps,
} from "@mantine/core";
import type { ChangeEvent, FocusEvent, Ref } from "react";
import { forwardRef, useLayoutEffect, useState } from "react";

import { TextInput } from "../TextInput";

type NumberValue = number | "";

export interface NumberInputProps
  extends Omit<
    _NumberInputProps,
    | "vars"
    | "classNames"
    | "styles"
    | "value"
    | "defaultValue"
    | "onChange"
    | "type"
  > {
  value: NumberValue;
  defaultValue?: NumberValue;
  onChange?: (value: NumberValue) => void;
  vars?: TextInputProps["vars"];
  classNames?: TextInputProps["classNames"];
  styles?: TextInputProps["styles"];
  type?: TextInputProps["type"] | "number";
}

export const NumberInput = forwardRef(function NumberInput(
  {
    value,
    defaultValue = value,
    onChange,
    onFocus,
    onBlur,
    ...props
  }: NumberInputProps,
  ref: Ref<HTMLInputElement>,
) {
  const [inputValue, setInputValue] = useState(formatValue(defaultValue ?? ""));
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    const newValue = parseValue(newInputValue);
    onChange?.(newValue);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  useLayoutEffect(() => {
    if (!isFocused) {
      setInputValue(formatValue(value ?? parseValue(inputValue)));
    }
  }, [value, inputValue, isFocused]);

  return (
    <TextInput
      {...props}
      ref={ref}
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

function parseValue(value: string) {
  const number = parseFloat(value);
  return Number.isNaN(number) ? "" : number;
}

function formatValue(value: number | string | "") {
  return String(value);
}
