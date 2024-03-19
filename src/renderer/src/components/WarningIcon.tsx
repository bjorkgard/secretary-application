import { useEffect, useState }     from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useTranslation }          from 'react-i18next'
import classNames                  from '@renderer/utils/classNames'
import type { ImportantDateModel } from 'src/types/models'

export function WarningIcon(): JSX.Element {
  const { t }                         = useTranslation()
  const [lastBackup, setLastBackup]   = useState<ImportantDateModel | null>(null)
  const [showWarning, setShowWarning] = useState<boolean>(false)

  useEffect(() => {
    const todayDate = new Date()

    window.electron.ipcRenderer.invoke('get-latest-backup').then((result: ImportantDateModel) => {
      if (result)
        setLastBackup(result)
      else
        setShowWarning(true)

      if (result && todayDate.getTime() - new Date(result.updatedAt || '').getTime() > 2592000000)
        setShowWarning(true)
      else
        setShowWarning(false)
    })
  }, [])

  return (
    <div
      className={classNames(
        showWarning
          ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500'
          : 'text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-500',
        '-m-2.5 p-2.5',
      )}
    >
      <span className="sr-only">View notifications</span>
      <div className="tooltip tooltip-left" data-tip={lastBackup ? t('backup.last', { date: lastBackup.updatedAt }) : t('backup.never')}>
        <ExclamationTriangleIcon className="size-6" aria-hidden="true" />
      </div>
    </div>
  )
}
