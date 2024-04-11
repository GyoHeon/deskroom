'use client';

import { Flex, Text } from "@radix-ui/themes";

type UploadInputGroupProps = {
  label: string;
  description: string;
  placeholder: string;
  id: string;
  name?: string;
} & React.HTMLAttributes<HTMLDivElement>;
export const UploadInputGroup: React.FC<UploadInputGroupProps> = ({
  label,
  description,
  placeholder,
  id,
  name,
}) => {
  return (
    <Flex direction="column">
      <label className="block text-lg font-bold">{label}</label>
      <Text className="text-sm">{description}</Text>
      <input className="p-2 border rounded my-2" type="text" placeholder={placeholder} id={id} name={name} />
    </Flex>
  )
}
