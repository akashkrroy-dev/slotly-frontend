import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiUserLine,
  RiArrowRightLine,
} from "react-icons/ri"

const icons = {
  mail: RiMailLine,
  lock: RiLockLine,
  eye: RiEyeLine,
  eyeOff: RiEyeOffLine,
  user: RiUserLine,
  arrowRight: RiArrowRightLine,
}

export type IconName = keyof typeof icons

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

const Icon = ({ name, size = 20, className }: IconProps) => {
  const Component = icons[name]
  return <Component size={size} className={className} aria-hidden="true" />
}

export default Icon