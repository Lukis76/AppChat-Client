import * as React from 'react'
import type { SVGProps } from 'react'

interface SVG extends SVGProps<SVGSVGElement> {
  size?: number
}

const SvgBack = (props: SVG) => (
  <svg
    viewBox={`0 0 22 22`}
    width={props.size || 48}
    height={props.size || 48}
    {...props}
  >
    <path d="m7.414 13 5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
  </svg>
)

export default SvgBack
