"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import ContactsService from "@/api/ContactsService";
import Select from "@/components/ui/Select";
import { useEffect } from "react";

const CreateContact = () => {
  const router = useRouter()

  const [createContact, isCreateLoading, createErr] = useFetching(async (contact) => {
    const response = await ContactsService.createContact(contact)
    if (response.status == 200) {
        alert("Контакт успешно создан!")
        router.push("/admin/contacts")
    } else {
      console.log(createErr)
    }
  })

  
  const {control, handleSubmit, watch } = useForm({
    mode: "onSubmit"
  })

  const watchContactType = watch("contactType")

  const onCreate = (data) => {
    const newContact = {
        name: data.name || contactTypes.find(c => c.value == data.contactType).label,
        value: data.value,
        contactType: data.contactType,
        isTopMainPageVisible: data.isTopMainPageVisible,
        isDeleted: false,
    }

    createContact(newContact)
  }

  const contactTypes = [
    {
      label: "Наш адрес",
      value: 0
    },
    {
      label: "Телефон",
      value: 1
    },
    {
      label: "График работы",
      value: 2
    },
    {
      label: "Приемная МФ МАДИ",
      value: 3
    }
  ]

  useEffect(() => {
    document.title = "Создание контакта - МФ МАДИ"
  }, [])

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Создание контакта</h1>
        <form
          action="#"
          className="admin-login__form form"
          onSubmit={handleSubmit(onCreate)}
        >
          <label className="form__label">
            <span className="form__text">Тип контакта</span>
            <Controller
              control={control}
              name="contactType"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={`${error ? "error" : ""}`}>
                  <Select
                    placeholder="Введите тип контакта"
                    isDisabled={false}
                    options={contactTypes}
                    onChange={(newValue) => onChange(newValue.value)}
                  />
                </div>
              )}
            />
          </label>
          <label className="form__label" style={{ display: watchContactType != 3 ? "none" : "block"}}>
            <span className="form__text">Название</span>
            <Controller
              control={control}
              name="name"
              rules={{
                required: watchContactType == 3,
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
            <span className="form__text">Значение (если тип "Приемная МФ МАДИ" - то пишется почта)</span>
            <Controller
              control={control}
              name="value"
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
          <label className="form__label form__label_checkbox">
            <span className="form__text">Отобразить в верху страницы? </span>
            <Controller
              control={control}
              name="isTopMainPageVisible"
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

export default CreateContact;
