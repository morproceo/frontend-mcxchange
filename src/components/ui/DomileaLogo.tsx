import { motion } from 'framer-motion'

interface DomileaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  animated?: boolean
}

const DomileaLogo = ({
  className = '',
  size = 'md',
  showText = true,
  animated = false
}: DomileaLogoProps) => {
  const sizeConfig = {
    sm: { height: 24, textSize: 'text-lg' },
    md: { height: 32, textSize: 'text-xl' },
    lg: { height: 40, textSize: 'text-2xl' },
    xl: { height: 56, textSize: 'text-4xl' }
  }

  const config = sizeConfig[size]

  const LogoSvg = () => (
    <svg
      viewBox="0 0 200 50"
      height={config.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* DOMILEA Text */}
      <text
        x="0"
        y="38"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="42"
        fontWeight="bold"
        fill="currentColor"
        letterSpacing="-1"
      >
        DOMILEA
      </text>

      {/* Swoosh - Black part */}
      <path
        d="M158 35 Q175 20, 198 8 L198 12 Q178 22, 162 35 Z"
        fill="currentColor"
      />

      {/* Swoosh - Blue part */}
      <path
        d="M162 35 Q180 24, 200 15 L200 22 Q182 30, 168 38 Z"
        fill="#5B9BD5"
      />
    </svg>
  )

  const IconOnlySvg = () => (
    <svg
      viewBox="0 0 50 50"
      height={config.height}
      width={config.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* D Letter */}
      <text
        x="5"
        y="38"
        fontFamily="Georgia, Times New Roman, serif"
        fontSize="42"
        fontWeight="bold"
        fill="currentColor"
      >
        D
      </text>

      {/* Swoosh - Black part */}
      <path
        d="M28 30 Q38 18, 48 8 L48 14 Q40 22, 32 32 Z"
        fill="currentColor"
      />

      {/* Swoosh - Blue part */}
      <path
        d="M32 32 Q42 22, 50 14 L50 22 Q44 28, 38 36 Z"
        fill="#5B9BD5"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center"
      >
        {showText ? <LogoSvg /> : <IconOnlySvg />}
      </motion.div>
    )
  }

  return showText ? <LogoSvg /> : <IconOnlySvg />
}

// Alternative: Full logo with embedded styles for better compatibility
export const DomileaLogoFull = ({
  className = '',
  height = 32
}: {
  className?: string
  height?: number
}) => (
  <svg
    viewBox="0 0 220 50"
    height={height}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#5B9BD5" />
      </linearGradient>
    </defs>

    {/* DOMILEA Text */}
    <text
      x="0"
      y="38"
      fontFamily="Georgia, 'Times New Roman', Times, serif"
      fontSize="42"
      fontWeight="700"
      fill="currentColor"
      letterSpacing="-1"
    >
      DOMILEA
    </text>

    {/* Swoosh - Black part */}
    <path
      d="M160 36 C170 28, 185 18, 205 6 L205 10 C188 20, 174 28, 165 35 Z"
      fill="currentColor"
    />

    {/* Swoosh - Blue part */}
    <path
      d="M165 36 C176 30, 190 22, 210 12 L210 20 C192 28, 178 34, 170 40 Z"
      fill="#5B9BD5"
    />
  </svg>
)

// Icon only version for collapsed sidebar
export const DomileaIcon = ({
  className = '',
  size = 32
}: {
  className?: string
  size?: number
}) => (
  <svg
    viewBox="0 0 40 40"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* D Letter */}
    <text
      x="2"
      y="32"
      fontFamily="Georgia, 'Times New Roman', Times, serif"
      fontSize="36"
      fontWeight="700"
      fill="currentColor"
    >
      D
    </text>

    {/* Swoosh - Black part */}
    <path
      d="M22 26 C28 20, 34 14, 40 8 L40 12 C35 17, 29 22, 25 27 Z"
      fill="currentColor"
    />

    {/* Swoosh - Blue part */}
    <path
      d="M25 28 C31 24, 36 18, 40 14 L40 20 C37 24, 32 28, 28 32 Z"
      fill="#5B9BD5"
    />
  </svg>
)

export default DomileaLogo
