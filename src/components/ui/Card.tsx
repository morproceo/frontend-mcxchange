import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, HTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const Card = ({
  children,
  hover = false,
  padding = 'md',
  className,
  ...props
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' } : {}}
      transition={{ duration: 0.3 }}
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        paddingStyles[padding],
        hover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('mb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={clsx('text-lg font-semibold text-gray-900', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={clsx('text-sm text-gray-500 mt-1', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx('mt-4 pt-4 border-t border-gray-100', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export default Card
