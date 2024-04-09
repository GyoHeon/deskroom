import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import "@mdxeditor/editor/style.css";
import { Theme } from "@radix-ui/themes";
import { OrganizationContextProvider } from "../contexts/OrganizationContext";
import mixpanel from "mixpanel-browser";
import { MixpanelProvider } from "@/contexts/MixpanelContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <OrganizationContextProvider>
              {children}
            </OrganizationContextProvider>
          </MixpanelProvider>
        </Theme>
      </body>
    </html>
  );
}
