import { useEffect, useState } from "react"

const ResizableWrapper = ({ children, savedWidth = 400, setSavedWidth }) => {
  const [width, setWidth] = useState(savedWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosX, setStartPosX] = useState(0)

  const startResize = (event: React.MouseEvent) => {
    setIsDragging(true)
    setStartPosX(event.clientX)
  }

  useEffect(() => {
    let newWidth = width
    const resizing = (event: MouseEvent) => {
      if (isDragging) {
        newWidth = width + (startPosX - event.clientX)
        setWidth(newWidth)
        setStartPosX(event.clientX)
      }
    }

    const stopResize = () => {
      setSavedWidth(newWidth)
      setIsDragging(false)
      document.removeEventListener("mousemove", resizing)
      document.removeEventListener("mouseup", stopResize)
    }

    if (isDragging) {
      document.addEventListener("mousemove", resizing)
      document.addEventListener("mouseup", stopResize)
    }

    return () => {
      document.removeEventListener("mousemove", resizing)
      document.removeEventListener("mouseup", stopResize)
    }
  }, [isDragging])

  return (
    <div
      className="fixed h-full right-0 overflow-x-auto resize-x"
      style={{
        width: `${width}px`
      }}>
      {children}
      <div
        className="absolute top-1/2 left-0 w-2 h-8 ml-0.5 rounded-sm bg-gray-400 z-10 cursor-ew-resize"
        onMouseDown={startResize}
      />
    </div>
  )
}

export default ResizableWrapper
