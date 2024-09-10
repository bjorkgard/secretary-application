import type { ReactElement }                              from 'react'
import { useTranslation }                                 from 'react-i18next'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './catalyst/dialog'
import { Button }                                         from './catalyst/button'

interface CardProps {
  children:   ReactElement
  title?:     string
  open:       boolean
  onClose:    () => void
  onConfirm?: () => void
}

export function Modal({ children, title, open, onClose, onConfirm }: CardProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogBody>{children}</DialogBody>
      {onConfirm && (
        <DialogActions>
          <Button
            outline
            onClick={() => onClose()}
          >
            {t('label.cancel')}
          </Button>
          <Button
            color="blue"
            onClick={() => onConfirm()}
          >
            {t('label.ok')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
