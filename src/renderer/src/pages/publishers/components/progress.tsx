import { CheckIcon }      from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'

interface ProgressProps {
  step: 'PERSONAL' | 'CONTACT' | 'APPOINTMENTS' | 'OTHER'
}

export default function Progress(props: ProgressProps): JSX.Element {
  const { t } = useTranslation()
  const steps = [
    { id: 1, name: t('publishers.step.personal'), step: 'PERSONAL' },
    { id: 2, name: t('publishers.step.contact'), step: 'CONTACT' },
    { id: 3, name: t('publishers.step.appointments'), step: 'APPOINTMENTS' },
    { id: 4, name: t('publishers.step.other'), step: 'OTHER' },
  ]

  const currentStep = steps.find(step => step.step === props.step)

  return (
    <nav aria-label="Progress" className="mx-auto my-4 w-10/12">
      <ol role="list" className="divide-y divide-gray-300 rounded-md border border-zinc-950/10 bg-transparent lg:flex lg:divide-y-0 dark:border-white/10 dark:bg-white/5">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative md:flex md:flex-1">
            {step.id < (currentStep?.id || 0)
              ? (
                  <div className="group flex w-full items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600">
                        <CheckIcon aria-hidden="true" className="size-6 text-white" />
                      </span>
                      <span className="ml-4 block text-sm font-medium text-gray-900 lg:hidden xl:block dark:text-white">{step.name}</span>
                    </span>
                  </div>
                )
              : step.step === props.step
                ? (
                    <div className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600">
                        <span className="text-blue-600">{step.id}</span>
                      </span>
                      <span className="ml-4 block text-sm font-medium text-blue-600 lg:hidden xl:block">{step.name}</span>
                    </div>
                  )
                : (
                    <div className="group flex items-center">
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <span className="text-gray-600">{step.id}</span>
                        </span>
                        <span className="ml-4 block text-sm font-medium text-gray-500 lg:hidden xl:block">
                          {step.name}
                        </span>
                      </span>
                    </div>
                  )}

            {
              stepIdx !== steps.length - 1
                ? (
                    <>
                      {/* Arrow separator for lg screens and up */}
                      <div aria-hidden="true" className="absolute right-0 top-0 hidden h-full w-5 lg:block">
                        <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none" className="size-full text-zinc-950/10 dark:text-white/10">
                          <path
                            d="M0 -2L20 40L0 82"
                            stroke="currentcolor"
                            vectorEffect="non-scaling-stroke"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </>
                  )
                : null
            }
          </li>
        ))}
      </ol>
    </nav>
  )
}
