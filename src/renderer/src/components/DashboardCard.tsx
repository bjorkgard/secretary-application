import clsx                    from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef }          from 'react'

export interface DashboardCardsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  warning?:   boolean
  info?:      boolean
}

export const DashboardCard = forwardRef<HTMLDivElement, DashboardCardsProps>(
  ({ children, className, warning = false, info = false, ...rest }, ref) => {
    return (
      <div className={clsx('relative', className)} {...rest} ref={ref}>
        <div className={clsx(
          info && '!bg-blue-500',
          warning && '!bg-red-600',
          (!warning && !info) && 'bg-white dark:bg-zinc-800',
          'relative size-full rounded-xl shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline',
        )}
        >
          <div className="grid size-full justify-items-center overflow-hidden p-4">
            <div className="w-full min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  },
)
