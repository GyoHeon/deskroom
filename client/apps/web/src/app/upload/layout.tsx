import { Sidebar } from "@/components/Sidebar"
import TopNav from "@/components/TopNav"
import { Box, Container, Flex } from "@radix-ui/themes"

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box className="flex">
      <Sidebar />
      <Flex direction={`column`} className="w-full">
        <TopNav />
        <Container className="px-16 py-4 bg-primary-100 min-h-[800px] h-screen w-full">
          <Box className="rounded-xl bg-white p-5">
            {children}
          </Box>
        </Container>
      </Flex>
    </Box>
  )
}
