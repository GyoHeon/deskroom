"use client";
import { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useMixpanel } from "./MixpanelContext";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
// Define the shape of the organization context
interface OrganizationContextType {
  currentOrg: Organization;
  setCurrentOrg: React.Dispatch<React.SetStateAction<Organization>>;
  availableOrgs: Organization[];
}

// Create the organization context
export const OrganizationContext = createContext<OrganizationContextType>({
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
}> = ({ children }) => {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization>(null);
  const mixpanel = useMixpanel();
  useEffect(() => {
    (async () => {
      const orgFromURL = searchParams.get("org");
      if (!orgFromURL) {
        return;
      }
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

      const { data: orgs, error: organizationError } = await supabase
        .from("organizations")
        .select("*, users!inner(*)")
        .eq("users.id", session.user.id);

      if (organizationError != null) {
        console.log(organizationError);
      }
      setOrganizations(orgs);
      setCurrentOrg(orgs.find((org) => org.key === orgFromURL));

      if (!mixpanel) {
        return
      }

      mixpanel.identify(session.user.id);

      mixpanel.register({
        org: orgFromURL,
        platform: "knowledge_base_admin",
      });
      mixpanel.people.set({
        $name: session.user.user_metadata.full_name,
        $email: session.user.email,
      });
    })();
  }, [searchParams, supabase]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg: currentOrg,
        setCurrentOrg: setCurrentOrg,
        availableOrgs: organizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
