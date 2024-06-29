import { useEffect, useState }         from 'react'
import { useNavigate }                 from 'react-router-dom'
import { SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline'
import classNames                      from '@renderer/utils/classNames'
import { useSettingsState }            from '@renderer/store/settingsStore'

export function OnlineIcon(): JSX.Element {
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const navigate                = useNavigate()
  const settingsState           = useSettingsState()

  useEffect(() => {
    setIsOnline(Object.values(settingsState.online).includes(true))
  }, [settingsState.online])

  return (
    <button
      type="button"
      className={classNames(
        isOnline
          ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-500'
          : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500',
        '-m-2.5 p-2.5',
      )}
      onClick={(): void => navigate('/settings')}
    >
      <span className="sr-only">View notifications</span>
      {isOnline
        ? (
            <div className="tooltip tooltip-left" data-tip="online">
              <SignalIcon className="size-6" aria-hidden="true" />
            </div>
          )
        : (
            <div className="tooltip tooltip-left" data-tip="offline">
              <SignalSlashIcon className="size-6" aria-hidden="true" />
            </div>
          )}
    </button>
  )
}
