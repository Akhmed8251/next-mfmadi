"use client"

import { useState, useEffect } from "react";
import MainMenuService from "@/api/MainMenuService";
import MenuService from "@/api/MenuService";
import { useFetching } from "@/hooks/useFetching";
import Loader from "@/components/ui/Loader";
import { formatTime } from "@/utils/time";
import Popup from "@/components/ui/Popup";
import getLocalStorage from "@/storage";

const AllMenuAdmin = () => {
  const { setCurrentPageName } = getLocalStorage()

  const [modalConfirmDeleteMainMenuActive, setModalConfirmDeleteMainMenuActive] = useState(false)
  const [modalConfirmDeleteMenuActive, setModalConfirmDeleteMenuActive] = useState(false)

  const [menuId, setMenuId] = useState(null)

  const [mainMenuList, setMainMenuList] = useState([])
  const [getMainMenuList, isMainMenuLoading, mainMenuErr] = useFetching(async () => {
      const response = await MainMenuService.getMainMenu()
      if (response.status === 200) {
          setMainMenuList(response.data)
      } else {
          console.log(mainMenuErr)
      }
  })

  const [menuList, setMenuList] = useState([])
  const [getMenuList, isMenuLoading, menuErr] = useFetching(async () => {
      const response = await MenuService.getMenu()
      if (response.status === 200) {
          setMenuList(response.data)
      } else {
          console.log(menuErr)
      }
  })

  const [deleteMainMenu, isDeleteMainMenuLoading, deleteMainMenuErr] = useFetching(async (menuId) => {
    const response = await MainMenuService.deleteMainMenu(menuId)
    if (response.status == 200) {
      alert("Меню успешно удалено!");
      closeModalConfirmDeleteMainMenu()
      deleteMenuFromTable(menuId)
    } else {
      console.log(deleteMainMenuErr);
    }
  });

  const [deleteMenu, isDeleteMenuLoading, deleteMenuErr] = useFetching(async (menuId) => {
    const response = await MenuService.deleteMenu(menuId)
    if (response.status == 200) {
      alert("Меню успешно удалено!");
      closeModalConfirmDeleteMenu()
      deleteMenuFromTable(menuId)
    } else {
      console.log(deleteMenuErr);
    }
  });

  const closeModalConfirmDeleteMainMenu = () => {
    setMenuId(null); 
    setModalConfirmDeleteMainMenuActive(false)
  }

  const closeModalConfirmDeleteMenu = () => {
    setMenuId(null); 
    setModalConfirmDeleteMenuActive(false)
  }

  const deleteMenuFromTable = (id) => {
    document.querySelector(`[data-id='${id}'`).remove()
  }

  const getParentMenuName = (menuId) => {
    const mainMenu = mainMenuList.find(m => m.id == menuId)
    if (mainMenu != null) {
      return mainMenu.name
    }
      
    return " - "
  }

  const getPosition = (menu) => {
    const resPositions = []

    if (!menu.topMainPageIsVisible && !menu.sideMenuIsVisible && !menu.menuAboveAdvertisingIsVisible) {
      return "В подвале сайта"
    }

    if (menu.topMainPageIsVisible) {
      resPositions.push("В шапке и подвале сайта (напротив логотипа)")
    }
    if (menu.sideMenuIsVisible) {
      resPositions.push("Боковое меню")
    }
    if (menu.menuAboveAdvertisingIsVisible) {
      resPositions.push("Над слайдером объявления")
    }
    
    return resPositions.join("; ")
  }

  useEffect(() => {
    document.title = "Меню - МФ МАДИ"
    setCurrentPageName("Меню")
    getMainMenuList()
    getMenuList()
  }, [])

  return (
    <>
      <section>
        <h1 className="admin-title title">Меню</h1>
        <a href={"/admin/main-menu/create"} className="create btn">
          Создать меню
        </a>
        <a href={"/admin/menu/create"} className="create btn">
          Создать дочернее меню
        </a>
        {isMainMenuLoading && isMenuLoading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Дата создания</th>
                <th>Название</th>
                <th>Ссылка</th>
                <th>Родительское меню</th>
                <th>Расположение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {mainMenuList.map((menu, idx) => (
                <tr data-id={menu.id} key={idx}>
                  <td>{formatTime(menu.createDate)}</td>
                  <td>{menu.name}</td>
                  <td>
                    <a href={menu.link}>{menu.link}</a>
                  </td>
                  <td>-</td>
                  <td>{getPosition(menu)}</td>
                  <td className="actions">
                    <a
                      href={`/admin/main-menu/edit/${menu.id}`}
                      className="edit btn"
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setMenuId(menu.id); setModalConfirmDeleteMainMenuActive(true) }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {menuList.map((menu, idx) => (
                <tr data-id={menu.id} key={idx}>
                  <td>{formatTime(menu.createDate)}</td>
                  <td>{menu.name}</td>
                  <td>
                    <a href={menu.link}>{menu.link}</a>
                  </td>
                  <td>{getParentMenuName(menu.mainMenuId)}</td>
                  <td>-</td>
                  <td className="actions">
                    <a
                      href={`/admin/menu/edit/${menu.id}`}
                      className="edit btn"
                      state={menu}
                    >
                      Изменить
                    </a>
                    <button className="delete btn" onClick={() => { setMenuId(menu.id); setModalConfirmDeleteMenuActive(true) }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <Popup active={modalConfirmDeleteMainMenuActive} setActive={closeModalConfirmDeleteMainMenu}>
      <h2 className="popup__title title">Вы действительно хотите удалить меню?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deleteMainMenu(menuId)} className='confirm-button confirm-button_yes' disabled={isDeleteMainMenuLoading} >
            {
              isDeleteMainMenuLoading ? <Loader isOnlySpinner/>
                :
                <span>Да</span>
            }
          </button>
          <button className="confirm-button confirm-button_no" onClick={closeModalConfirmDeleteMainMenu}>Нет</button>
        </div>
      </Popup>
      <Popup active={modalConfirmDeleteMenuActive} setActive={closeModalConfirmDeleteMenu}>
      <h2 className="popup__title title">Вы действительно хотите удалить дочернее меню?</h2>
        <div className="confirm-buttons">
          <button onClick={() => deleteMenu(menuId)} className='confirm-button confirm-button_yes' disabled={isDeleteMenuLoading} >
            {
              isDeleteMenuLoading ? <Loader isOnlySpinner/>
                :
                <span>Да</span>
            }
          </button>
          <button className="confirm-button confirm-button_no" onClick={closeModalConfirmDeleteMenu}>Нет</button>
        </div>
      </Popup>
    </>
  );
};

export default AllMenuAdmin;
