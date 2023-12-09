import { useRouteError } from 'react-router-dom'

export default function ErrorPage(): JSX.Element {
  const error: unknown = useRouteError()

  // TODO: Show if error else a spinning loading icon
  return (
    <div id="error-page" className="flex h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
      </p>
    </div>
  )
}
