"use client";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Avatar, DropdownMenu, Flex, Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export type TopNavProps = {
  shouldShowLogo?: boolean;
} & React.HTMLProps<HTMLDivElement>;

const TopNav: React.FC<TopNavProps> = ({ shouldShowLogo }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { currentOrg, availableOrgs, setCurrentOrg } = useOrganizationContext();
  const [org, setOrg] = useState<string>('');

  useEffect(() => {
    setInterval(() => {
      if (!currentOrg) return;
      if (org === currentOrg?.name_kor) return;
      setOrg(currentOrg?.name_kor);
    }, 100);
  }, []);

  const handleOrgChange = (org: string) => {
    if (!availableOrgs) return;
    if (org === currentOrg?.name_kor) return;
    const selectedOrg = availableOrgs.find((o) => o.name_kor === org);
    setCurrentOrg(selectedOrg)
  };
  const handleLogoutButtonClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
      return
    }
    router.push('/v1/login')

    // TODO: track logout
  }

  return (
    <Flex className="px-16 py-4" align={`center`} justify="center">
      {
        shouldShowLogo && (
          <Flex className="items-center mx-2 cursor-pointer"
            onClick={() => router.push(`/?org=${searchParams.get("org") ?? ""}`)}
          >
            <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={40} height={40} className="mx-2 self-start" />
            <Image
              src="/deskroom-logo.png"
              width={100}
              height={30}
              alt="deskrooom-logo"
            />
          </Flex>
        )
      }
      <Flex className="ml-auto gap-5">
        <Select.Root
          defaultValue={'조직'}
          value={currentOrg?.name_kor ?? org}
          onValueChange={handleOrgChange}
          size="2"
        >
          <Select.Trigger className="font-semibold w-fit min-w-24" />
          <Select.Content>
            <Select.Group>
              <Select.Label>조직</Select.Label>
              {availableOrgs.map((org) => (
                <Select.Item key={org.key} value={org.name_kor}>
                  {org.name_kor}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar
              size="2"
              className="ml-auto"
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
              fallback="A"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item shortcut="⌘ O" onClick={handleLogoutButtonClick}>Logout</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex >
  );
};

export default TopNav;
