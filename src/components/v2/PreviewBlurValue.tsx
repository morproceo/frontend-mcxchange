import { useContext, createContext } from 'react'

// Shared preview mode context — set by CarrierPulsePage, consumed by child components
export const PreviewModeContext = createContext<boolean>(false)

export function usePreviewMode(): boolean {
  return useContext(PreviewModeContext)
}

interface PreviewBlurValueProps {
  children: React.ReactNode
  /** Override: force blur regardless of context (default: uses context) */
  blur?: boolean
  /** 'value' blurs inline text, 'chart' blurs a block-level chart container */
  variant?: 'value' | 'chart'
  className?: string
}

/**
 * Wraps children with a CSS blur when in preview mode.
 * - variant="value" (default): inline blur on text/numbers
 * - variant="chart": block-level blur on chart containers
 */
export default function PreviewBlurValue({
  children,
  blur,
  variant = 'value',
  className = '',
}: PreviewBlurValueProps) {
  const previewMode = usePreviewMode()
  const shouldBlur = blur ?? previewMode

  if (!shouldBlur) {
    return <>{children}</>
  }

  if (variant === 'chart') {
    return (
      <div className={`relative ${className}`}>
        <div className="blur-[4px] select-none pointer-events-none">
          {children}
        </div>
      </div>
    )
  }

  return (
    <span className={`blur-[6px] select-none pointer-events-none inline-block ${className}`}>
      {children}
    </span>
  )
}
