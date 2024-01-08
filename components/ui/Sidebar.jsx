"use client"

import React, { useEffect } from 'react'
import getLocalStorage from '../../storage'

export const pages = [
  {
    label: "Новости",
    value: "news"
  },
  {
    label: "Партнеры",
    value: "partners"
  },
  {
    label: "Объявления",
    value: "advertisings"
  },
  {
    label: "Контакты",
    value: "contacts"
  },
  {
    label: "Страницы",
    value: "screens"
  },
  {
    label: "ОбМАДИ",
    value: "about"
  },
  {
    label: "Меню",
    value: "menu"
  }
]

const Sidebar = () => {  
  const { isOpenSidebar, setIsOpenSidebar, currentPageName } = getLocalStorage()

  const clearLinks = () => {
    const links = document.querySelectorAll(".sidebar__item")
    links.forEach(link => {
      if (link.classList.contains("_active")) {
        link.classList.remove("_active")
      }
    })
  }

  const setActiveLinkByName = (activeSideBarLinkName) => {
    clearLinks()

    const linkActive = document.querySelector(`[data-name=${activeSideBarLinkName}]`)
    linkActive.classList.add("_active")
  }

  useEffect(() => {
    if (currentPageName) {
      setActiveLinkByName(currentPageName)
    }
  }, [currentPageName])

  return (
    <aside className={`sidebar ${isOpenSidebar ? "_open" : ""}`}>
      <ul className="sidebar__list">
        {
          pages.map((page, idx) => (
            <li key={idx} className="sidebar__item" data-name={page.label}>
              <a href={`/admin/${page.value}`} className='sidebar__link'>
                {page.label}
              </a>
            </li>
          ))
        }
      </ul>
    </aside>
  )
}

export default Sidebar