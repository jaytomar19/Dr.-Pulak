'use client';

import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, 'type'> {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'textarea';
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      name,
      type = 'text',
      error,
      helperText,
      required,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const inputClassNames = [
      'input-group__input',
      error ? 'input-group__input--error' : '',
    ].filter(Boolean).join(' ');

    const containerClassNames = [
      'input-group',
      className,
    ].filter(Boolean).join(' ');

    const ariaDescribedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={containerClassNames}>
        <label htmlFor={inputId} className="input-group__label">
          {label} {required && <span className="input-group__required" aria-hidden="true">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClassNames}
            required={required}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!!error}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClassNames}
            required={required}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!!error}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        
        {error && (
          <div id={errorId} className="input-group__error" aria-live="polite">
            {error}
          </div>
        )}
        {helperText && !error && (
          <div id={helperId} className="input-group__helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
