import CloseIcon from "../../../public/close-icon.svg"

const style = `
  body {
    margin: 20px 24px;
  }
  header {
    margin-bottom: 40px;
  }
  main {
    background-color: #EFF1F999;
    color: #616161;
    display: flex;
    flex-direction: column;
    padding: 9px 16px;
    gap: 10px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 21px;
  }
  main p {
    white-space: pre-line;
  }

  .title {
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
  }
  .contents-title {
    font-size: 11px;
    line-height: 14px;
    color: #8b8d97;
  }
  .description {
    font-size: 13px;
    line-height: 16px;
    color: #8b8d97;
  }
  .header-top {
    display: flex;
    justify-content: space-between; 
  }
  .close-button {
    width: 32px;
    height: 32px;
    border: 0;
    background-color: white;
    cursor: pointer;
  }
`

const head = `
  <head>
    <style>
      ${style}
    </style>
    <title>
      첨부 이미지
    </title>
  </head>
`
const closeButtonStr = `<button class="close-button" aria-role="close">
  <img src=${CloseIcon} alt="Close Button" style="width: 32px; height: 32px;">
</button>`

type OpenPopupProps = {
  contentsRaw: string
  title: string
  description: string
  contentsTitle: string
}

const openPopup = ({
  contentsRaw,
  description,
  title,
  contentsTitle
}: OpenPopupProps) => {
  const openFn = () => {
    const contents = `
    <html>
      ${head}
      <body>
        <header>
          <div class="header-top">
            <h1 class="title">${title}</h1>
            ${closeButtonStr}
          </div>

          <span class="description">${description}</span>
        </header>

        <span class="contents-title">${contentsTitle}</span>

        <main>
          ${contentsRaw}
        </main>
      </body>
    </html>
  `

    const popupWindow = window.open(
      "",
      `${title} popup`,
      "width=800,height=1200"
    )

    popupWindow.document.write(contents)

    popupWindow.document.close()

    popupWindow.onload = () => {
      const closeButton = popupWindow.document.getElementsByClassName(
        "close-button"
      )[0] as HTMLButtonElement

      closeButton.onclick = () => popupWindow.close()
    }
  }

  return openFn
}

export default openPopup
