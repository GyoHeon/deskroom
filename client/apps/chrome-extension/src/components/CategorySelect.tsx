import { Flex } from "@radix-ui/themes"

import { useDeskroomUser } from "~contexts/DeskroomUserContext"

const CategorySelect = () => {
  const { category, setCategory } = useDeskroomUser()

  if (!category?.availableCategories?.length) {
    return (
      <Flex className="sidebar-category-select">
        <select
          name="category"
          id="category"
          value="카테고리"
          className="mx-2 w-fit rounded-md border border-1 text-xs border-gray-900 px-[2px] py-[0.5px] h-fit"
          defaultValue="카테고리"
          >
          <option defaultValue='카테고리' >
            카테고리
          </option>
        </select>
      </Flex>
    )
  }

  return (
    <Flex className="sidebar-category-select">
      <select
        name="category"
        id="category"
        value={category?.currentCategory.name || "카테고리"}
        onChange={(e) => {
          setCategory({
            availableCategories: category?.availableCategories ?? [],
            currentCategory: category?.availableCategories.find(
              (o) => o.name === e.target.value
            )
          }).catch((err) => {
            console.error(err) // NOTE: QUOTA_BYTES_PER_ITEM Error
          })
        }}
        className="mx-2 w-fit rounded-md border border-1 text-xs border-gray-900 px-[2px] py-[0.5px] h-fit">
        {category?.availableCategories.map(({ name, id }) => (
          <option value={name} key={id}>
            {name}
          </option>
        ))}
      </select>
    </Flex>
  )
}

export default CategorySelect
