import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  variant?: 'default' | 'strong' | 'subtle'
  hover?: boolean
  className?: string
}

/**
 * GlassCard - Kept for backward compatibility
 * For new components, prefer using the Card component instead
 */
const GlassCard = ({
  children,
  variant = 'default',
  hover = true,
  className,
  ...props
}: GlassCardProps) => {
  const variantClasses = {
    default: 'bg-white border border-gray-100 shadow-sm',
    strong: 'bg-white border border-gray-200 shadow-md',
    subtle: 'bg-gray-50 border border-gray-100',
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' } : {}}
      transition={{ duration: 0.3 }}
      className={clsx(
        variantClasses[variant],
        'rounded-2xl p-6 transition-all',
        hover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
