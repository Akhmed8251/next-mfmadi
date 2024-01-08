"use client"

import { Controller, useForm } from "react-hook-form";
import NewsService from "@/api/NewsService";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from 'next/navigation'
import CKEditorUI from "@/components/ui/CKEditorUI";
import FileModelService from "@/api/FileModelService";
import { useEffect } from "react";

const CreateNews = () => {
  const router = useRouter()

  const [createFileModel, isCreateFileModelLoading, createFileModelErr] = useFetching(async (creatingFileModel) => {
    const response = await FileModelService.createFileModel(creatingFileModel)
    if (response.status == 200) {
      alert("Новость успешно создана!")
      router.push('/admin/news')
    }
  })

  const [createNews, isCreateLoading, createErr] = useFetching(async (news, files) => {
    const response = await NewsService.createNews(news)
    if (response.status == 200) {
      const formData = new FormData()
      formData.append("contentId", response.data.content.id)
      Array.from(files).forEach(file => {
        formData.append("formFiles", file)
      })

      createFileModel(formData)
    } else {
      console.log(createErr)
    }
  })

  
  const {control, handleSubmit} = useForm({
    mode: "onSubmit"
  })


  const onCreate = (data) => {
    const newNews = {
      isDeleted: false,
      content: {
        title: data.title,
        htmlContent: data.htmlContent,
        fileModels: null,
        isDeleted: false,
        contentType: 0,
        parentId: 0
      }
    }
    createNews(newNews, data.fileModels)
  }

  useEffect(() => {
    document.title = 'Создание новости - МФ МАДИ'
  }, [])

  return (
    <section>
      <div className="container">
        <h1 className="admin-title title">Создание новости</h1>
        <form
          action="#"
          className="admin-login__form form"
          onSubmit={handleSubmit(onCreate)}
          encType="multipart/form-data"
        >
          <label className="form__label">
            <span className="form__text">Заголовок</span>
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
            <span className="form__text">Изображения</span>
            <Controller
              control={control}
              name="fileModels"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <input
                  type="file"
                  multiple={true}
                  className={`form__input ${error ? " error" : ""}`}
                  onChange={(newValue) => onChange(newValue.target.files)}
                />
              )}
            />
          </label>
          <label className="form__label">
            <span className="form__text">Контент</span>
            <Controller
              control={control}
              name="htmlContent"
              rules={{
                required: true,
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className={`${error ? "error" : ""}`}>
                  <CKEditorUI
                    onChange={(newValue) => {onChange(newValue.editor.getData())}}
                  />
                </div>
              )}
            />
          </label>
          <button
            className={`form__btn btn`}
            disabled={(isCreateLoading || isCreateFileModelLoading) }
          >
            {(isCreateLoading || isCreateFileModelLoading)  ? "Создание..." : "Создать"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateNews;
