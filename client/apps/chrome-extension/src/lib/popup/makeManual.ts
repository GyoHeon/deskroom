const makeManual = (manual: string) => {
  const pTag = document.createElement("p")
  pTag.innerText = manual

  return pTag.outerText.toString()
}

export default makeManual
