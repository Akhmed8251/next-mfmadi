"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import MainMenuService from "@/api/MainMenuService";
import MenuService from "@/api/MenuService";
import Select from "@/components/ui/Select";
import { useState, useEffect } from "react";

const CreateMenu = () => {
  const router = useRouter()

  const [createMenu, isCreateLoading, createErr] = useFetching(async (mainMenu) => {
    const response = await MenuService.createMenu(mainMenu)
    if (response.status == 200) {
      alert("Дочернее меню успешно создано!")
      router.push("/admin/menu")
    } else {
      console.log(createErr)
    }
  })

  const [mainMenuList, setMainMenuList] = useState([])
  const [getMainMenuList, isMainMenuLoading, mainMenuErr] = useFetching(async () => {
      const response = await MainMenuService.getMainMenu()
      if (response.status === 200) {
        let dataArr = []
        response.data.forEach(dataItem => {
            dataArr.push({
                value: dataItem.id,
                label: dataItem.name
            })
        })
        setMainMenuList(dataArr)
      } else {
          console.log(mainMenuErr)
      }
  })

  
  const {control, handleSubmit } = useForm({
    mode: "onSubmit",
  })

  const onCreate = (data) => {
    const newMenu = {
        name: data.title,
        link: data.link,
        mainMenuId: data.mainMenuId,
        isDeleted: false
    }

    createMenu(newMenu)
  }

  useEffect(() => {
    document.title = "Создание дочернего меню - МФ МАДИ"
    getMainMenuList()
  }, [])

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Создание дочернего меню</h1>
        <form
          action="#"
          className="admin-login__form form"
          onSubmit={handleSubmit(onCreate)}
          encType="multipart/form-data"
        >
          <label className="form__label">
            <span className="form__text">Родительское меню</span>
            <Controller
              control={control}
              name="mainMenuId"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={`${error ? "error" : ""}`}>
                  <Select
                    placeholder="Введите меню"
                    options={mainMenuList}
                    isDisabled={isMainMenuLoading}
                    isLoading={isMainMenuLoading}
                    onChange={(newValue) => onChange(newValue.value)}
                  />
                </div>
              )}
            />
          </label>  
          <label className="form__label">
            <span className="form__text">Название</span>
            <Controller
              control={control}
              name="title"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="text"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue)}
                />
              )}
            />
          </label>
          <label className="form__label">
            <span className="form__text">Ссылка</span>
            <Controller
              control={control}
              name="link"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="text"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue)}
                />
              )}
            />
          </label>    
          <button
            className={`form__btn btn`}
            disabled={isCreateLoading}
          >
            {isCreateLoading ? "Создание..." : "Создать"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateMenu;
