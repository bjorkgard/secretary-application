import { Heading }                  from '@renderer/components/catalyst/heading'
import { DashboardCard }            from '@renderer/components/DashboardCard'
import { useEffect, useState }      from 'react'
import { useTranslation }           from 'react-i18next'
import type { InformationResponse } from 'src/types/models'
import Markdown                     from 'react-markdown'
import { Button }                   from '@renderer/components/catalyst/button'
import { XMarkIcon }                from '@heroicons/react/24/solid'

export default function Information(): JSX.Element | null {
  const { t } = useTranslation()

  const [reload, setReload]       = useState(true)
  const [responses, setResponses] = useState<InformationResponse[]>([])

  useEffect(() => {
    if (reload) {
      window.electron.ipcRenderer.invoke('get-information').then((responses) => {
        setResponses(responses)
        setReload(false)
      })
    }
  }, [reload])

  const closeInformation = (id: number) => {
    window.electron.ipcRenderer.invoke('delete-information', { id }).then(() => {
      setReload(true)
    })
  }

  if (!responses.length) {
    return null
  }

  return (
    <>
      {
        responses.map((response) => {
          if (response.version && response.version !== import.meta.env.RENDERER_VITE_APP_VERSION) {
            return null
          }

          return (
            <DashboardCard key={response.id} info={true} className="col-span-full">
              <div className="flex w-full justify-between">
                <Heading>{response.headline}</Heading>
                <Button type="button" outline onClick={() => closeInformation(response.id)} title={t('label.deleteInformation')}>
                  <XMarkIcon className="size-6 !text-white" />
                </Button>
              </div>
              <Markdown className="prose prose-white text-base/6 text-white">{response.data}</Markdown>
            </DashboardCard>
          )
        })
      }
    </>
  )
}
