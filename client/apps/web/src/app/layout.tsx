import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { OrganizationContextProvider } from "../contexts/OrganizationContext";
import { MixpanelProvider } from "@/contexts/MixpanelContext";
import { createClient } from "@/utils/supabase/server";
import { Organization } from "@/lib/supabase.types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://app.deskroom.so"),
  alternates: {
    canonical: "/",
  },
  title: "Deskroom | 데스크룸",
  description: "더 유저에게 가까이",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://app.deskroom.so",
    siteName: "Deskroom",
    images: [
      {
        url: "/deskroom-logo.png",
        alt: "Deskroom Logo",
        width: 120,
        height: 40,
      },
    ],
  },
};

export async function getAvailableOrganizations(userID: string | undefined): Promise<Organization[]> {
  if (!userID) {
    return [];
  }
  const supabase = createClient();
  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("*, users!inner(id, email)")
    .eq("users.id", userID);

  if (organizationError != null) {
    throw organizationError;
  }

  if (!organizations || organizations.length === 0) {
    return [];
  }

  return organizations;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const organizations = await getAvailableOrganizations(user?.id);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="inherit" grayColor="sage" accentColor={`iris`}>
          <MixpanelProvider
            token={process.env.NEXT_PUBLIC_MIXPANEL_API_KEY}
            config={{
              debug: process.env.NODE_ENV !== "production",
              persistence: "localStorage",
            }}
            name={`deskroom-${process.env.NODE_ENV}`}
          >
            <OrganizationContextProvider availableOrgs={organizations}>
              {children}
            </OrganizationContextProvider>
          </MixpanelProvider>
        </Theme>
      </body>
    </html>
  );
}
