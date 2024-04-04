import { Box, Flex } from "@radix-ui/themes"

export default function V1FormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box className="h-screen">
      <Flex justify={`center`} align={`center`} height={`100%`} direction={`column`}>
        {children}
      </Flex>
    </Box>
  )
}
