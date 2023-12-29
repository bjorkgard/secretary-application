import { useTranslation } from 'react-i18next'

export const Spinner = ({ show }: { show: boolean }): JSX.Element | null => {
  const { t } = useTranslation()

  return show ? (
    <div className="w-full h-full fixed top-0 left-0 bg-gray-500/75 dark:bg-slate-700/75 z-50">
      <div className="flex justify-center items-center mt-[40vh] flex-col">
        <span className="loading loading-bars loading-lg"></span>
        <h2 className="text-center text-gray-800 dark:text-white text-xl font-semibold animate-pulse">
          {t('spinner.loading')}
        </h2>
        <p className="w-1/3 text-center text-gray-800 dark:text-white animate-pulse">
          {t('spinner.loadingText')}
        </p>
      </div>
    </div>
  ) : null
}
