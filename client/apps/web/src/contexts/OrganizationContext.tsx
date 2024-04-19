"use client";
import { Database } from "@/lib/database.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useMixpanel } from "./MixpanelContext";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
// Define the shape of the organization context
interface OrganizationContextType {
  user: User
  currentOrg: Organization;
  setCurrentOrg: React.Dispatch<React.SetStateAction<Organization>>;
  availableOrgs: Organization[];
}

// Create the organization context
export const OrganizationContext = createContext<OrganizationContextType>({
  user: null,
  currentOrg: null,
  setCurrentOrg: () => { },
  availableOrgs: [],
});

export const useOrganizationContext = (): OrganizationContextType => {
  const context = React.useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within an OrganizationContextProvider"
    );
  }
  return context;
};
// Create the OrganizationContextProvider component
export const OrganizationContextProvider: React.FC<{
  children: ReactNode;
  availableOrgs: Organization[];
}> = ({ children, availableOrgs }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [currentOrg, setCurrentOrg] = useState<Organization>(null);
  const [user, setUser] = useState<User>(null)
  const mixpanel = useMixpanel();

  useEffect(() => {
    if (!currentOrg && !searchParams.get("org")) {
      return;
    }

    if (!currentOrg && searchParams.get("org")) {
      const selectedOrg = availableOrgs.find((o) => o.key === searchParams.get("org"));
      setCurrentOrg(selectedOrg);
      return;
    }

    if (searchParams.get("org") === currentOrg.key) {
      return;
    }

    mixpanel.register({
      org: searchParams.get("org"),
      platform: "knowledge_base_admin",
    });
    router.push(`${pathname}?org=${currentOrg.key}`);
  }, [currentOrg?.key])

  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error: loginError,
      } = await supabase.auth.getSession();

      if (!!loginError) {
        return;
      }

      if (!session) {
        return;
      }

      setUser(session.user)

      if (searchParams.get("org") && currentOrg === null) {
        setCurrentOrg(availableOrgs.find((o) => o.key === searchParams.get("org")));
      }

      if (!mixpanel) {
        return
      }

      mixpanel.identify(session.user.id);
      mixpanel.people.set({
        $name: session.user.user_metadata.full_name,
        $email: session.user.email,
      });

    })();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg: currentOrg,
        setCurrentOrg: setCurrentOrg,
        availableOrgs,
        user
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
