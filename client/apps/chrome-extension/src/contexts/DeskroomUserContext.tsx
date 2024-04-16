import type { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { OrganizationStorage } from "~api/organization"

import { useMixpanel } from "./MixpanelContext"

type UserContext = {
  user: User | null
  setUser: (user: Setter<User | null>) => Promise<void>
  org: OrganizationStorage | null
  setOrg: (org: Setter<OrganizationStorage | null>) => Promise<void>
}
type Setter<T> = ((v?: T, isHydrated?: boolean) => T) | T

const userContext = createContext<UserContext | undefined>(undefined)
const useDeskroomUser = (): UserContext => useContext(userContext)
interface UserProviderProps {
  children: React.ReactNode
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [orgs, setOrg] = useStorage<OrganizationStorage | null>("orgs")
  const [user, setUser] = useStorage<User | null>("user")
  const mixpanel = useMixpanel()

  useEffect(() => {
    if (!user) return
    mixpanel.identify(user.id)
    mixpanel.register({
      email: user.email
    })
  }, [user])

  useEffect(() => {
    if (orgs) {
      mixpanel.register({
        org: orgs.currentOrg.key
      })
    }
  }, [orgs])

  const value = {
    user,
    setUser,
    org: orgs,
    setOrg
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>
}
export { UserProvider as DeskroomUserProvider, useDeskroomUser }
