import { SelectHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border bg-white text-gray-900',
            'transition-all duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 focus:border-secondary-500 focus:ring-secondary-500/20',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select'

export default Select
