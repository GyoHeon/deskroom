"use client";
import { useMixpanel } from "@/contexts/MixpanelContext";
import { Organization } from "@/contexts/OrganizationContext";
import { Avatar, Box, DropdownMenu, Flex, Select, useThemeContext } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type TopNavProps = {
  organizations: Organization[];
  currentOrg: string;
} & React.HTMLProps<HTMLDivElement>;

const TopNav: React.FC<TopNavProps> = ({ organizations, currentOrg }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const mixpanel = useMixpanel();
  const supabase = createClientComponentClient();

  useEffect(() => {
    mixpanel.register({
      org: searchParams.get("org"),
      platform: "knowledge_base_admin",
    });
  }, [mixpanel, searchParams]);

  const handleOrgChange = (org: string) => {
    const selectedOrg = organizations.find((o) => o.name_kor === org);
    router.push(`${pathname}?org=${selectedOrg.key}`);
  };
  const theme = useThemeContext();
  const isDarkMode = theme.appearance === "dark";
  const handleLogoutButtonClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
      return
    }
    router.refresh()

    // TODO: track logout
  }

  return (
    <Flex className="px-16 py-4" align={`center`}>
      <Box
        className="cursor-pointer"
        onClick={() => router.push(`/?org=${searchParams.get("org") ?? ""}`)}
      >
        <Image
          src={isDarkMode ? "/deskroom-logo-white.png" : "/deskroom-logo.png"} // TODO: use default when theme is light mode.
          width={120}
          height={40}
          alt="deskrooom-logo"
        />
      </Box>
      <Flex className="ml-auto gap-5">
        <Select.Root
          defaultValue={currentOrg}
          onValueChange={handleOrgChange}
          size="2"
        >
          <Select.Trigger className="font-semibold w-24" />
          <Select.Content>
            <Select.Group>
              <Select.Label>조직</Select.Label>
              {organizations.map((org) => (
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
    </Flex>
  );
};

export default TopNav;
