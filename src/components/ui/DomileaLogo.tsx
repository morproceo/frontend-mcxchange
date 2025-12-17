import { motion } from 'framer-motion'
import domileaMainLogo from '../../assets/domileaMain.png'

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
    sm: { height: 24 },
    md: { height: 32 },
    lg: { height: 40 },
    xl: { height: 56 }
  }

  const config = sizeConfig[size]

  const LogoImg = () => (
    <img
      src={domileaMainLogo}
      alt="Domilea"
      height={config.height}
      style={{ height: config.height }}
      className={className}
    />
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center"
      >
        <LogoImg />
      </motion.div>
    )
  }

  return <LogoImg />
}

// Full logo component using domileaMain.png
export const DomileaLogoFull = ({
  className = '',
  height = 32
}: {
  className?: string
  height?: number
}) => (
  <img
    src={domileaMainLogo}
    alt="Domilea"
    height={height}
    style={{ height }}
    className={className}
  />
)

// Icon only version for collapsed sidebar
export const DomileaIcon = ({
  className = '',
  size = 32
}: {
  className?: string
  size?: number
}) => (
  <img
    src={domileaMainLogo}
    alt="Domilea"
    height={size}
    style={{ height: size, objectFit: 'contain', objectPosition: 'left' }}
    className={className}
  />
)

// Main logo version (domileaMain.png) - same as DomileaLogoFull
export const DomileaMainLogo = ({
  className = '',
  height = 32
}: {
  className?: string
  height?: number
}) => (
  <img
    src={domileaMainLogo}
    alt="Domilea"
    height={height}
    style={{ height }}
    className={className}
  />
)

export default DomileaLogo
