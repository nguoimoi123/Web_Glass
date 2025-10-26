import React, { ReactNode, forwardRef, useId } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'ghost' | 'invalid';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const baseStyles = 'flex items-center rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantStyles = {
    default: 'border-gray-300 bg-white focus:ring-blue-500',
    ghost: 'border-transparent bg-transparent focus:ring-blue-500',
    invalid: 'border-red-500 bg-red-50 focus:ring-red-400',
  };
  const sizeStyles = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const paddingLeft = leftIcon ? 'pl-9' : '';
  const paddingRight = rightIcon ? 'pr-9' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && <label htmlFor={inputId} className='mb-1 block text-sm font-medium text-gray-700'>{label}</label>}
      <div className='relative'>
        {leftIcon && <span className='absolute left-3 top-1/2 -translate-y-1/2'>{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${paddingLeft} ${paddingRight} ${widthClass} ${className}`}
          {...props}
        />
        {rightIcon && <span className='absolute right-3 top-1/2 -translate-y-1/2'>{rightIcon}</span>}
      </div>
      {helperText && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;