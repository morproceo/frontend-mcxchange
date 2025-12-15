import { TextareaHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
            'transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 focus:border-secondary-500 focus:ring-secondary-500/20',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export default Textarea
