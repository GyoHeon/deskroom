"use client";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { Database } from "@/lib/database.types";
import {
  User
} from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useMixpanel } from "./MixpanelContext";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
// Define the shape of the organization context
interface OrganizationContextType {
  user: User;
  currentOrg: Organization;
  setCurrentOrg: React.Dispatch<React.SetStateAction<Organization>>;
  availableOrgs: Organization[];
}

// Create the organization context
export const OrganizationContext = createContext<OrganizationContextType>({
  user: null,
  currentOrg: null,
  setCurrentOrg: () => {},
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
  user?: User;
}> = ({ children, availableOrgs, user }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentOrg, setCurrentOrg] = useState<Organization>(null);
  const [currentOrgInStorage, setCurrentOrgInStorage] = useLocalStorage<string>(
    "currentOrg",
    null
  );
  const mixpanel = useMixpanel();
  const getOrgFromSearchParams = () => {
    const orgFromSearchParams = searchParams.get("org");
    return availableOrgs.find((o) => o.key === orgFromSearchParams);
  };

  const getOrgFromStorage = () => {
    return availableOrgs.find((o) => o.key === currentOrgInStorage);
  };
  const getDefaultOrg = () => {
    return availableOrgs[0];
  };

  useEffect(() => {
    if (!availableOrgs || currentOrg) {
      return;
    }

    const orgFromSearchParams = getOrgFromSearchParams();
    const orgFromStorage = getOrgFromStorage();
    const defaultOrg = getDefaultOrg();

    if (orgFromSearchParams) {
      setCurrentOrg(orgFromSearchParams);
    } else if (orgFromStorage) {
      setCurrentOrg(orgFromStorage);
    } else {
      setCurrentOrg(defaultOrg);
    }
  }, [availableOrgs, currentOrg, pathname, currentOrgInStorage]);

  useEffect(() => {
    if (!currentOrg) {
      return;
    }

    setCurrentOrgInStorage(currentOrg.key);
    mixpanel.register({
      org: currentOrg.key,
      platform: "knowledge_base_admin",
    });
    router.push(`${pathname}?org=${currentOrg.key}`);
  }, [currentOrg]);

  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }

      if (!mixpanel) {
        return;
      }

      mixpanel.identify(user.id);
      mixpanel.people.set({
        $name: user.user_metadata.full_name,
        $email: user.email,
      });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg: currentOrg,
        setCurrentOrg: setCurrentOrg,
        availableOrgs,
        user,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
