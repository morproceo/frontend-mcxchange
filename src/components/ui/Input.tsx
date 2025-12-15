import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-200 focus:border-secondary-500 focus:ring-secondary-500/20',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
