import { Box, Flex } from "@radix-ui/themes"

export default function V1FormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box className="h-screen">
      <Flex justify={`center`} align={`center`} direction={`column`} className="h-screen">
        {children}
      </Flex>
    </Box>
  )
}
