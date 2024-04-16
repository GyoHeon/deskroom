'use client'

import { Database } from "@/lib/database.types";
import { CubeIcon, GlobeIcon, UpdateIcon, UploadIcon } from "@radix-ui/react-icons";
import { Box, Flex, Grid, useThemeContext } from "@radix-ui/themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SidebarMenu = {
  title: string
  icon: React.ReactNode,
  url?: string,
  disabled?: boolean
}
const sidebarMenus: SidebarMenu[] = [
  { title: "Knowledge Base", icon: <CubeIcon />, url: "/" },
  {
    title: "카테고리 관리하기", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.4425 10.0575L10.065 15.435C9.92569 15.5745 9.76026 15.6851 9.57816 15.7606C9.39606 15.8361 9.20087 15.8749 9.00375 15.8749C8.80663 15.8749 8.61144 15.8361 8.42934 15.7606C8.24724 15.6851 8.08181 15.5745 7.9425 15.435L1.5 9V1.5H9L15.4425 7.9425C15.7219 8.22354 15.8787 8.60372 15.8787 9C15.8787 9.39628 15.7219 9.77646 15.4425 10.0575V10.0575Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.25 5.25H5.2575" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    url: "/categories"
  },
  { title: "Q&A 최신화하기", icon: <UpdateIcon />, disabled: true },
  {
    title: "VOC 분석하기", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2366_16013)">
        <path d="M13.4166 10.5L7.87492 4.95833L4.95825 7.875L0.583252 3.5" stroke="#C3C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.91675 10.5H13.4167V7" stroke="#C3C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_2366_16013">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>,
    disabled: true
  },
  {
    title: "외부에 배포하기", icon: <GlobeIcon />,
    disabled: true
  },
  {
    title: "상담 팀 관리하기", icon: <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2366_16069)">
        <path d="M20.125 5.25L11.8125 13.5625L7.4375 9.1875L0.875 15.75" stroke="#C3C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.875 5.25H20.125V10.5" stroke="#C3C3C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_2366_16069">
          <rect width="21" height="21" fill="white" />
        </clipPath>
      </defs>
    </svg>,

    disabled: true
  },
]

const secretSidebarMenus: SidebarMenu[] = [
  {
    title: "업로드 작업", icon: (<UploadIcon />), url: "/upload/list"
  }
]
export const Sidebar = () => {
  const theme = useThemeContext();
  const isDarkMode = theme.appearance === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const supabase = createClientComponentClient<Database>()
  const [canReadJobs, setCanReadJobs] = useState(false);
  useEffect(() => {
    const checkJobs = async () => {
      const { data: jobs, error: jobsError } = await supabase.from("uploads").select("*").eq('org_key', searchParams?.get('org')).limit(1).single();
      if (!!jobs) {
        setCanReadJobs(true);
      }
    }
    checkJobs();
  }, [])

  return (
    <aside id="default-sidebar" className="w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 xs:hidden" aria-label="Sidebar">
      <Box className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800"
      >
        <Flex className="items-center mb-6 mx-2 cursor-pointer"
          onClick={() => router.push(`/?org=${searchParams.get("org") ?? ""}`)}
        >
          <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={40} height={40} className="mx-2 self-start" />
          <Image
            src={isDarkMode ? "/deskroom-logo-white.png" : "/deskroom-logo.png"} // TODO: use default when theme is light mode.
            width={100}
            height={30}
            alt="deskrooom-logo"
          />
        </Flex>
        {
          sidebarMenus.map((menu, index) => (
            <Grid className={`group items-center justify-start p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer h-12 ${menu.disabled && 'text-gray-300 cursor-not-allowed'} ${menu.url === pathname ? 'bg-primary-900 text-white shadow-lg hover:bg-primary-900 transition-all duration-300' : ''}`} columns="4" key={index}
              onClick={() => {
                if (menu.disabled) return;
                router.push(`${menu.url}?org=${searchParams.get("org") ?? ""}`);
              }}
            >
              <Box className="col-span-1">
                {menu.icon}
              </Box>
              <Box className="col-span-3" >{menu.title}</Box>
            </Grid>
          ))
        }
        {
          canReadJobs && secretSidebarMenus.map((menu, index) => (
            <Grid className={`group items-center justify-start p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer h-12 ${menu.disabled && 'text-gray-300 cursor-not-allowed'} ${menu.url === pathname ? 'bg-primary-900 text-white shadow-lg hover:bg-primary-900 transition-all duration-300' : ''}`} columns="4" key={index}
              onClick={() => {
                if (menu.disabled) return;
                router.push(`${menu.url}?org=${searchParams.get("org") ?? ""}`);
              }}
            >
              <Box className="col-span-1">
                {menu.icon}
              </Box>
              <Box className="col-span-3" >{menu.title}</Box>
            </Grid>
          ))
        }
      </Box>
    </aside>
  );
}

