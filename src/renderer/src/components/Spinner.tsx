import { useTranslation } from 'react-i18next'

export function Spinner({ show }: { show: boolean }): JSX.Element | null {
  const { t } = useTranslation()

  return show
    ? (
      <div className="fixed left-0 top-0 z-50 size-full bg-gray-500/75 dark:bg-slate-700/75">
        <div className="mt-[40vh] flex flex-col items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
          <h2 className="animate-pulse text-center text-xl font-semibold text-gray-800 dark:text-white">
            {t('spinner.loading')}
          </h2>
          <p className="w-1/3 animate-pulse text-center text-gray-800 dark:text-white">
            {t('spinner.loadingText')}
          </p>
        </div>
      </div>
      )
    : null
}
