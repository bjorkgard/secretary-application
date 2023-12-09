import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import icon from '../../assets/256x256.png'
import ROUTES from '../../constants/routes.json'
import { SettingsModel } from 'src/types/models'
import { useSettingsState } from '@renderer/store/settingsStore'

function Loading(): JSX.Element {
  const navigate = useNavigate()
  const settingsState = useSettingsState()

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-settings')
      .then((settings: SettingsModel) => {
        if (settings) {
          settingsState.setSettings(settings)
          navigate(ROUTES.DASHBOARD)
        } else {
          navigate(ROUTES.SETUP)
        }
      })
      .catch(() => {
        navigate(ROUTES.SETUP)
      })
  }, [])

  return (
    <div className="grid h-screen place-content-center">
      <div>
        <img src={icon} alt="icon" />
      </div>
      <span className="mt-2 text-center text-4xl font-black tracking-widest">SECRETARY</span>
    </div>
  )
}

export default Loading
