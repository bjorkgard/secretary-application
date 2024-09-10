import { BriefcaseIcon }                       from '@heroicons/react/20/solid'
import { Link }                                from '@renderer/components/catalyst/link'
import { Navbar, NavbarSection, NavbarSpacer } from '@renderer/components/catalyst/navbar'
import { OnlineIcon }                          from '@renderer/components/OnlineIcon'
import { Updates }                             from '@renderer/components/Updates'
import { WarningIcon }                         from '@renderer/components/WarningIcon'

export function Header(): JSX.Element {
  return (
    <Navbar>
      <Link
        href="/"
        aria-label="Home"
        className="flex w-56 text-2xl font-black tracking-widest text-blue-700 dark:text-blue-500"
      >
        <BriefcaseIcon className="mr-2 size-8" />
        SECRETARY
      </Link>
      <NavbarSpacer />
      <NavbarSection>
        <Updates />
        <WarningIcon />
        <OnlineIcon />
      </NavbarSection>
    </Navbar>
  )
}
