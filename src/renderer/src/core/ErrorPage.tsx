import { useRouteError } from 'react-router-dom'

export default function ErrorPage(): JSX.Element {
  const error: unknown = useRouteError()
  return (
    <div id="error-page" className="flex h-screen flex-col items-center justify-center gap-8">
      <div
        className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >
          Loading...
        </span>
      </div>
      <p className="text-slate-400">
        <i>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
      </p>
    </div>
  )
}
