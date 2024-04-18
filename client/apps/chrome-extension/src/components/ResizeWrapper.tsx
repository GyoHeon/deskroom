import { useEffect, useState } from "react"

const ResizableWrapper = ({ children }) => {
  const [width, setWidth] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosX, setStartPosX] = useState(0)

  const startResize = (event: React.MouseEvent) => {
    setIsDragging(true)
    setStartPosX(event.clientX)
  }

  useEffect(() => {
    const resizing = (event: MouseEvent) => {
      if (isDragging) {
        const newWidth = width + (startPosX - event.clientX)
        setWidth(newWidth)
        setStartPosX(event.clientX)
      }
    }

    const stopResize = () => {
      setIsDragging(false)
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
        className="absolute top-1/2 left-0 cursor-ew-resize w-2 h-5 bg-red-500 z-10"
        onMouseDown={startResize}
      />
    </div>
  )
}

export default ResizableWrapper
