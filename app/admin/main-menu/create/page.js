"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import MainMenuService from "@/api/MainMenuService";
import { useEffect } from "react";

const CreateMainMenu = () => {
  const router = useRouter()

  const [createMainMenu, isCreateLoading, createErr] = useFetching(async (mainMenu) => {
    const response = await MainMenuService.createMainMenu(mainMenu)
    if (response.status == 200) {
      alert("Меню успешно создано!")
      router.push("/admin/menu")
    } else {
      console.log(createErr)
    }
  })

  
  const {control, handleSubmit, watch } = useForm({
    mode: "onSubmit",
    defaultValues: {
      topMainPageIsVisible: false,
      sideMenuIsVisible: false,
      menuAboveAdvertisingIsVisible: false,
    }
  })

  const onCreate = (data) => {
    const newMainMenu = {
        name: data.title,
        link: data.link,
        topMainPageIsVisible: data.topMainPageIsVisible,
        sideMenuIsVisible: data.sideMenuIsVisible,
        menuAboveAdvertisingIsVisible: data.menuAboveAdvertisingIsVisible,
        isDeleted: false
    }

    createMainMenu(newMainMenu)
  }

  useEffect(() => {
    document.title = "Создание меню - МФ МАДИ"
  }, [])

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Создание меню</h1>
        <form
          action="#"
          className="admin-login__form form"
          onSubmit={handleSubmit(onCreate)}
          encType="multipart/form-data"
        >
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
          <span className="form__info">Расположение меню на сайте (если ничего не выбрать, то отображается в подвале сайта)</span>
          <label className="form__label form__label_checkbox">
            <span className="form__text">В шапке и подвале сайта (напротив логотипа)</span>
            <Controller
              control={control}
              name="topMainPageIsVisible"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.checked)}
                />
              )}
            />
          </label>
          <label className="form__label form__label_checkbox">
            <span className="form__text">Боковое меню</span>
            <Controller
              control={control}
              name="sideMenuIsVisible"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.checked)}
                />
              )}
            />
          </label>
          <label className="form__label form__label_checkbox">
            <span className="form__text">Над слайдером объявления</span>
            <Controller
              control={control}
              name="menuAboveAdvertisingIsVisible"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="checkbox"
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.checked)}
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

export default CreateMainMenu;
