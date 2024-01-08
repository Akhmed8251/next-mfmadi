"use client";

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import MainMenuService from "@/api/MainMenuService";
import MenuService from "@/api/MenuService";
import Select from "@/components/ui/Select";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";

const EditMenu = ({ params }) => {
  const router = useRouter();

  const [editMenu, isEditLoading, createErr] = useFetching(async (mainMenu) => {
    const response = await MenuService.editMenu(mainMenu);
    if (response.status == 200) {
      alert("Дочернее меню успешно изменено!");
      router.push("/admin/menu");
    } else {
      console.log(createErr);
    }
  });

  const [mainMenuList, setMainMenuList] = useState([]);
  const [getMainMenuList, isMainMenuLoading, mainMenuErr] = useFetching(
    async () => {
      const response = await MainMenuService.getMainMenu();
      if (response.status === 200) {
        let dataArr = [];
        response.data.forEach((dataItem) => {
          dataArr.push({
            value: dataItem.id,
            label: dataItem.name,
          });
        });
        setMainMenuList(dataArr);
      } else {
        console.log(mainMenuErr);
      }
    }
  );

  const [editedMenu, setEditedMenu] = useState(null);
  const [getMenu, isMenuLoading, menuErr] = useFetching(async (id) => {
    const response = await MenuService.getMenuById(id);
    if (response.status == 200) {
      setEditedMenu(response.data);
      reset({
        title: response.data.name,
        link: response.data.link,
        mainMenuId: response.data.mainMenuId
      });
    }
  });

  const { control, handleSubmit, reset } = useForm({
    mode: "onSubmit"
  });

  const onEdit = (data) => {
    const newMenu = {
      id: editedMenu.id,
      name: data.title,
      link: data.link,
      createDate: editedMenu.createDate,
      mainMenuId: data.mainMenuId,
      isDeleted: false,
    };

    editMenu(newMenu);
  };

  useEffect(() => {
    document.title = "Изменение дочернего меню - МФ МАДИ";
    getMainMenuList();
    getMenu(params.id);
  }, []);

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Изменение дочернего меню</h1>
        {(isMenuLoading && isMainMenuLoading) ? (
          <Loader />
        ) : (
          <form
            action="#"
            className="admin-login__form form"
            onSubmit={handleSubmit(onEdit)}
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
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <div className={`${error ? "error" : ""}`}>
                    <Select
                      value={mainMenuList?.find((m) => m.value == value)}
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
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    value={value}
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
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    value={value}
                    type="text"
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue)}
                  />
                )}
              />
            </label>
            <button className={`form__btn btn`} disabled={isEditLoading}>
              {isEditLoading ? "Изменение..." : "Изменить"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EditMenu;
