import { useEffect, useState } from 'react'
import { useTranslation }      from 'react-i18next'

export function Updates(): JSX.Element | null {
  const { t }                       = useTranslation()
  const [newVersion, setNewVersion] = useState<string | undefined>(undefined)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-latest-version').then((data: string) => {
      if (data)
        setNewVersion(data)
    })
  }, [])

  if (!newVersion || newVersion === import.meta.env.RENDERER_VITE_APP_VERSION)
    return null

  return (
    <a
      href="https://github.com/bjorkgard/secretary-application/releases/latest"
      target="_blank"
      className="flex cursor-pointer font-bold text-green-600 underline-offset-2 hover:underline"
    >
      <span>{t('updates.newVersion', { tag: newVersion })}</span>
    </a>
  )
}
