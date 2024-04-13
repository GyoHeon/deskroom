import TopNav from "@/components/TopNav"
import { Box, Container, Flex } from "@radix-ui/themes"

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex direction={`column`}>
      <TopNav />
      <Container className="px-16 py-4 bg-primary-100 min-h-[800px] h-screen">
        <Box className="rounded-xl bg-white p-5">
          {children}
        </Box>
      </Container>
    </Flex>
  )
}
