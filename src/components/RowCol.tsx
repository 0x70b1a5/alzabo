import classNames from "classnames"
import React from "react"

export const Row: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props}) => {
  return <div className={classNames("flex flex-row", className)} {...props}>
    {children}
  </div>
}

export const Col: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props}) => {
  return <div className={classNames("flex flex-col", className)} {...props}>
    {children}
  </div>
}