"use client";
import { useMixpanel } from "@/contexts/MixpanelContext";
import { Organization } from "@/contexts/OrganizationContext";
import { Avatar, Box, Flex, Select, useThemeContext } from "@radix-ui/themes";
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
        <Avatar
          size="2"
          className="ml-auto"
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
          fallback="A"
        />
      </Flex>
    </Flex>
  );
};

export default TopNav;
