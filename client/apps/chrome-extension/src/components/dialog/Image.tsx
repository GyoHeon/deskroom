import openPopup from "~lib/popup/openPopup"

import SaveIcon from "./SaveIcon"

interface ImageProps {
  images: string[]
  isCollapsed: boolean
}

const Image = ({ images, isCollapsed }: ImageProps) => {
  if (!images.length) {
    return <></>
  }
  const openImagePopup = openPopup({
    contentsRaw: images
      .map((image) => `<img src="${image}" alt="image" style="width: 100%;">`)
      .join(""),
    title: "첨부 이미지",
    description: "상담을 진행하면서 참조할 수 있는 이미지 목록입니다.",
    contentsTitle: "이미지 목록"
  })

  return (
    <button onClick={openImagePopup}>
      <SaveIcon active={!isCollapsed} />
    </button>
  )
}

export default Image
