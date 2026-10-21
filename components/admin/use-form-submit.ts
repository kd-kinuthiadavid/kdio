"use client";

import { useTransition, type FormEvent } from "react";

/**
 * Dispatches a `useActionState` action from onSubmit instead of `<form action>`.
 * React resets forms after `<form action>` runs, which wipes typed values and
 * desyncs controlled selects when the server returns validation errors.
 */
export function useFormSubmit(
  dispatch: (formData: FormData) => void,
  shouldSubmit: () => boolean = () => true
) {
  const [, startTransition] = useTransition();
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shouldSubmit()) return;
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
}
