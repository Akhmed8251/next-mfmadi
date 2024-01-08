export const parsingCKEditorData = (ckeditorData) => {
  const divEl = document.createElement('div')
  divEl.insertAdjacentHTML("beforeend", ckeditorData)

  const accordeonControls = divEl.querySelectorAll(".accordeon__control")
  if (accordeonControls.length > 0) {
    accordeonControls.forEach(control => {
      control.closest("li").classList.add("accordeon__item")
      control.closest("ul").classList.add("accordeon__list")
    })
  
  }

  const resHTML = divEl.innerHTML
  return resHTML
}