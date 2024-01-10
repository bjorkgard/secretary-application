import { useEffect, useState } from 'react'
import { useTranslation }      from 'react-i18next'
import { ArrowUpTrayIcon }     from '@heroicons/react/20/solid'
import type { TemplateModel }  from 'src/types/models'
import TEMPLATES               from '../../constants/templates.json'

export default function Templates(): JSX.Element {
  const { t } = useTranslation()

  const [templates, setTemplates] = useState<TemplateModel[]>()
  const [reload, setReload]       = useState<boolean>(true)

  useEffect(() => {
    const removeListener = window.electron.ipcRenderer.on('template-imported', () => {
      setReload(true)
    })

    return () => {
      removeListener()
    }
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-templates')
      .then((templates: TemplateModel[]) => setTemplates(templates))
      .then(() => {
        setReload(false)
      })
  }, [reload])

  const upload = (key: string): void => {
    switch (key) {
      case 'S-21':
        window.electron.ipcRenderer.invoke('import-template', {
          code: 'S-21',
          name: t('templates.S-21'),
          date: '11/23',
        })
        break
      case 'S-88':
        window.electron.ipcRenderer.invoke('import-template', {
          code: 'S-88',
          name: t('templates.S-88'),
          date: '12/18',
        })
        break

      default:
        break
    }
  }

  return (
    <div className="min-h-full">
      <h1>{t('templates.headline')}</h1>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold leading-7 text-gray-900 dark:text-slate-300">
              {t('templates.description')}
              <p>
                {!templates || templates?.length < 1
                  ? (
                    <span className="font-bold uppercase text-red-500">
                      {t('templates.someMissing')}
                    </span>
                    )
                  : (
                      ''
                    )}
              </p>
            </div>
          </div>
          <div className="grid max-w-2xl md:col-span-2">
            <table className="table table-zebra mt-0">
              {/* head */}
              <thead>
                <tr>
                  <th>{t('templates.name')}</th>
                  <th>{t('templates.code')}</th>
                  <th>{t('templates.date')}</th>
                  <th>{t('templates.uploadedAt')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(TEMPLATES).map(key => (
                  <tr key={key}>
                    <td>{t(`templates.${key}`)}</td>
                    <th>{key}</th>
                    <td>{TEMPLATES[key]}</td>
                    <td>
                      {templates?.find(t => t.code === key)
                      && templates?.find(t => t.code === key)?.date === TEMPLATES[key]
                        ? (
                            templates?.find(t => t.code === key)?.updatedAt
                          )
                        : (
                          <span className="font-bold uppercase text-red-500">
                            {t('templates.missing')}
                          </span>
                          )}
                    </td>
                    <td className="flex justify-end">
                      <button
                        className="btn btn-circle btn-outline btn-xs"
                        onClick={() => upload(key)}
                      >
                        <ArrowUpTrayIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
