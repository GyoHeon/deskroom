import { Flex } from "@radix-ui/themes"

import { useDeskroomUser } from "~contexts/DeskroomUserContext"

const OrgSelect = () => {
  // TODO: set org and category by select
  const { org, setOrg } = useDeskroomUser()

  if (!org?.availableOrgs.length) {
    return <></>
  }

  return (
    <Flex className="sidebar-organization-select">
      <select
        name="organization"
        id="organization"
        value={org?.currentOrg.name_kor}
        onChange={(e) => {
          setOrg({
            availableOrgs: org?.availableOrgs ?? [],
            currentOrg: org?.availableOrgs.find(
              (o) => o.name_kor === e.target.value
            )
          }).catch((err) => {
            console.error(err) // NOTE: QUOTA_BYTES_PER_ITEM Error
          })
        }}
        className="mx-2 w-fit rounded-md border border-1 text-xs border-gray-900 px-[2px] py-[0.5px] h-fit">
        {org?.availableOrgs.map((org, orgIndex) => (
          <option value={org.name_kor} key={orgIndex}>
            {org.name_kor}
          </option>
        ))}
      </select>
    </Flex>
  )
}

export default OrgSelect
