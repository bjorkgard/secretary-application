import classNames from '@renderer/utils/classNames'

type CardProps = {
  children: React.ReactNode
  title?: string
  footer?: string
  loading: boolean
}

export const Card = ({ children, title, footer, loading = false }: CardProps): JSX.Element => {
  return (
    <div className="card card-bordered col-span-1 bg-gray-50 shadow-xl dark:bg-slate-800">
      <div
        className={classNames(
          loading ? 'animate-pulse' : '',
          'card-body w-full items-center p-4 text-center'
        )}
      >
        {title ? (
          loading ? (
            <div className="mt-2 h-6 w-full rounded bg-slate-200" />
          ) : (
            <h2 className="card-title mb-1">{title}</h2>
          )
        ) : null}

        {children}

        {footer ? (
          loading ? (
            <div className="mt-2 h-4 w-full rounded bg-slate-200" />
          ) : (
            <div className="mt-2 w-full text-right text-sm text-gray-700 dark:text-slate-400">
              {footer}
            </div>
          )
        ) : null}
      </div>
    </div>
  )
}
