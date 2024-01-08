"use client"

import { Controller, useForm } from "react-hook-form";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import ContactsService from "@/api/ContactsService";
import Select from "@/components/ui/Select";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

const EditContact = ({ params }) => {
  const router = useRouter();

  const [editContact, isEditLoading, editErr] = useFetching(async (contact) => {
    const response = await ContactsService.editContact(contact);
    if (response.status == 200) {
      alert("Контакт успешно обновлен!");
      router.push("/admin/contacts");
    } else {
      console.log(editErr);
    }
  });

  const [defaultWatchValue, setDefaultWatchValue] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [getContact, isContactLoading, contactErr] = useFetching(async (id) => {
    const response = await ContactsService.getContactById(id);
    if (response.status == 200) {
      setEditedContact(response.data);
      reset({
        contactType: response.data.contactType,
        name: response.data.name,
        value: response.data.value,
        isTopMainPageVisible: response.data.isTopMainPageVisible,
      });
      setDefaultWatchValue(response.data.contactType);
    }
  });

  const { control, handleSubmit, watch, reset } = useForm({
    mode: "onSubmit",
  });

  const watchContactType = watch("contactType", defaultWatchValue);

  const onEdit = (data) => {
    const editableContact = {
      id: editedContact.id,
      name:
        data.contactType == 3
          ? data.name
          : contactTypes.find((c) => c.value == data.contactType).label,
      value: data.value,
      contactType: data.contactType,
      isTopMainPageVisible: data.isTopMainPageVisible,
      isDeleted: false,
      createDate: editedContact.createDate,
      updateDate: editedContact.updateDate,
    };

    editContact(editableContact);
  };

  const contactTypes = [
    {
      label: "Наш адрес",
      value: 0,
    },
    {
      label: "Телефон",
      value: 1,
    },
    {
      label: "График работы",
      value: 2,
    },
    {
      label: "Приемная МФ МАДИ",
      value: 3,
    },
  ];

  useEffect(() => {
    document.title = "Изменение контакта - МФ МАДИ";
    getContact(params.id);
  }, []);

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Изменение контакта</h1>
        {isContactLoading ? (
          <Loader />
        ) : (
          <form
            action="#"
            className="admin-login__form form"
            onSubmit={handleSubmit(onEdit)}
          >
            <label className="form__label">
              <span className="form__text">Тип контакта</span>
              <Controller
                control={control}
                name="contactType"
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <div className={`${error ? "error" : ""}`}>
                    <Select
                      value={contactTypes.find((c) => c.value == value)}
                      isDisabled={false}
                      options={contactTypes}
                      onChange={(newValue) => onChange(newValue.value)}
                    />
                  </div>
                )}
              />
            </label>
            <label
              className="form__label"
              style={{ display: watchContactType != 3 ? "none" : "block" }}
            >
              <span className="form__text">Название</span>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: watchContactType == 3,
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
              <span className="form__text">
                Значение (если тип "Приемная МФ МАДИ" - то пишется почта)
              </span>
              <Controller
                control={control}
                name="value"
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
            <label className="form__label form__label_checkbox">
              <span className="form__text">Отобразить в верху страницы? </span>
              <Controller
                control={control}
                name="isTopMainPageVisible"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <input
                    checked={value}
                    type="checkbox"
                    className={`form__input ${error ? " error" : ""}`}
                    onChange={(newValue) => onChange(newValue.target.checked)}
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

export default EditContact;

