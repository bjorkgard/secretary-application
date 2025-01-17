import { useEffect, useState }                                           from 'react'
import { useTranslation }                                                from 'react-i18next'
import { ArrowUpTrayIcon }                                               from '@heroicons/react/20/solid'
import type { TemplateModel }                                            from 'src/types/models'
import { Fieldset }                                                      from '@renderer/components/catalyst/fieldset'
import { Heading }                                                       from '@renderer/components/catalyst/heading'
import { Button }                                                        from '@renderer/components/catalyst/button'
import { Text }                                                          from '@renderer/components/catalyst/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@renderer/components/catalyst/table'
import TEMPLATES                                                         from '../../constants/templates.json'

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
    <div>
      <Fieldset>
        <div>
          <Heading>{t('templates.headline')}</Heading>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <Text>{t('templates.description')}</Text>
            <Text className="pt-2">{t('templates.description2')}</Text>
            {!templates || templates?.length < 1
              ? (
                  <Text className="font-bold uppercase text-red-500">
                    {t('templates.someMissing')}
                  </Text>
                )
              : (
                  ''
                )}
          </div>
          <div className="col-span-2">
            <Table sticky dense grid striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
              <TableHead>
                <TableRow>
                  <TableHeader>{t('templates.name')}</TableHeader>
                  <TableHeader>{t('templates.code')}</TableHeader>
                  <TableHeader>{t('templates.date')}</TableHeader>
                  <TableHeader>{t('templates.uploadedAt')}</TableHeader>
                  <TableHeader>&nbsp;</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(TEMPLATES).map(key => (
                  <TableRow key={key}>
                    <TableCell>{t(`templates.${key}`)}</TableCell>
                    <TableCell className="font-bold">{key}</TableCell>
                    <TableCell>{TEMPLATES[key]}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button outline onClick={() => upload(key)}>
                        <ArrowUpTrayIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Fieldset>
    </div>
  )
}
