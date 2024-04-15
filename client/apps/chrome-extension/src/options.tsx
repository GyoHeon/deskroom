import type { User } from "@supabase/supabase-js"

import "data-text:@radix-ui/themes/styles.css"

import { useEffect, useState } from "react"

import "~/style.css"

import * as _Sentry from "@sentry/react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~core/supabase"
import type { Database } from "~lib/database.types"

import { name, version } from "../package.json"

const Sentry = _Sentry

Sentry.init({
  dsn: process.env.PLASMO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: `deskroom-extension@v${version}`
})

export type Organization = Pick<
  Database["public"]["Tables"]["organizations"]["Row"],
  "id" | "name_eng" | "name_kor" | "key"
>
export type OrganizationStorage = {
  availableOrgs: Organization[]
  currentOrg: Organization | undefined
}

const buttonStyle = {
  backgroundColor: "whitesmoke",
  border: "unset",
  padding: "8px 16px",
  margin: "8px 0"
}

const getOrgs = async (userId: string) => {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name_eng, name_kor, key, users!inner(*)")
    .eq("users.id", userId)

  if (error != null) {
    console.error(error)
  }
  for (const org of data) {
    delete org.users
  }
  return data
}

function IndexOptions() {
  const [user, setUser] = useStorage<User>("user")
  const [orgs, setOrgs] = useStorage<OrganizationStorage>("orgs")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }

      const organizations = await getOrgs(data.session.user.id)

      if (!organizations) {
        throw new Error("No organizations found for this user")
      }
      setOrgs({
        availableOrgs: organizations,
        currentOrg: organizations[0]
      })

      if (!!data.session) {
        await setUser(data.session.user)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const handleEmailLogin = async (
    type: "LOGIN" | "SIGNUP",
    username: string,
    password: string
  ) => {
    try {
      const {
        error,
        data: { user }
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password
            })
          : await supabase.auth.signUp({ email: username, password })

      if (error) {
        alert("Error with auth: " + error.message)
      } else if (!user) {
        alert("Signup successful, confirmation mail should be sent soon!")
      } else {
        await setUser(user)
        const availableOrgs = await getOrgs(user.id)
        if (!availableOrgs) {
          throw new Error("No organizations found for this user")
        }
        await setOrgs({
          availableOrgs,
          currentOrg: orgs?.currentOrg || availableOrgs[0]
        })
      }
    } catch (error) {
      alert(error.error_description || error)
      throw error
    }
  }

  // TODO: remove mixpanel in options
  return (
    <main
      className="flex justify-center items-center w-full top-240 relative"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        top: 240,
        position: "relative",
        flexDirection: "column",
        fontSize: 16,
        fontFamily:
          "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
      }}>
      <h1 className="deskroom-options-title">Deskroom</h1>
      <div className="deskroom-organization">
        Organization: {orgs?.currentOrg?.name_kor}
      </div>
      <div
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-4.2 content-between w-96"
        style={{
          display: "flex",
          flexDirection: "column",
          width: 240,
          justifyContent: "space-between",
          gap: 4.2
        }}>
        {user && (
          <>
            <h3>
              {user.email} - {user.id}
            </h3>
            <button
              style={buttonStyle}
              onClick={() => {
                supabase.auth.signOut()
                setUser(null)
                setOrgs(null)
              }}>
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <label>Email</label>
            <input
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={buttonStyle}
              onClick={(e) => {
                handleEmailLogin("SIGNUP", username, password)
              }}>
              Sign up
            </button>
            <button
              style={buttonStyle}
              onClick={(e) => {
                handleEmailLogin("LOGIN", username, password)
              }}>
              Login
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default Sentry.withProfiler(IndexOptions)
