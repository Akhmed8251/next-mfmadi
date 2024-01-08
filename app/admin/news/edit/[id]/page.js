"use client";

import { Controller, useForm } from "react-hook-form";
import NewsService from "@/api/NewsService";
import { useFetching } from "@/hooks/useFetching";
import { useRouter } from "next/navigation";
import CKEditorUI from "@/components/ui/CKEditorUI";
import FileModelService from "@/api/FileModelService";
import { FILES_URL } from "@/api/config";
import { useEffect, useState } from "react";
import Popup from "@/components/ui/Popup";
import Loader from "@/components/ui/Loader";
import deleteIcon from "@/assets/images/menu-close.svg";

const EditNews = ({ params }) => {
  const router = useRouter();

  const [modalConfirmDeleteActive, setModalConfirmDeleteActive] =
    useState(false);
  const [editedNews, setEditedNews] = useState(null);
  const [fileModels, setFileModels] = useState(null);
  const [getNewsById, isGetNewsLoading, getNewsErr] = useFetching(
    async (newsId) => {
      const response = await NewsService.getNewsById(newsId);
      if (response.status == 200) {
        setEditedNews(response.data);
        reset({
          title: response.data?.content?.title,
          htmlContent: response.data?.content?.htmlContent,
        });
        setFileModels(
          response.data.content?.fileModels.filter((f) => f.isDeleted == false)
        );
      }
    }
  );

  const [deletingImageId, setDeletingImageId] = useState(null);
  const [createFileModel, isCreateFileModelLoading, createFileModelErr] =
    useFetching(async (creatingFileModel) => {
      const response = await FileModelService.createFileModel(
        creatingFileModel
      );
      if (response.status == 200) {
        alert("Новость успешно обновлена!");
        router.push("/admin/news");
      }
    });

  const [editNews, isEditLoading, editErr] = useFetching(
    async (news, files = null) => {
      const response = await NewsService.updateNews(news);
      if (response.status == 200) {
        const formData = new FormData();
        if (files) {
          formData.append("contentId", news.content.id);
          Array.from(files).forEach((file) => {
            formData.append("formFiles", file);
          });

          createFileModel(formData);
        } else {
          alert("Новость успешно обновлена!");
          router.push("/admin/news");
        }
      } else {
        console.log(editErr);
      }
    }
  );

  const [deleteFileModel, isDeleteLoading, deleteErr] = useFetching(
    async (fileModelId) => {
      const response = await FileModelService.deleteFileModel(fileModelId);
      if (response.status == 200) {
        alert("Удаление фотографий прошло успешно!");
        closeModalConfirmDelete();
        deleteImageFromList(fileModelId);
      }
    }
  );

  const deleteImageFromList = (id) => {
    document.querySelector(`[data-id='${id}'`).remove();
  };

  const closeModalConfirmDelete = () => {
    setDeletingImageId(null);
    setModalConfirmDeleteActive(false);
  };

  const onEdit = (data) => {
    const news = {
      id: editedNews.id,
      mainText: editedNews.mainText,
      isDeleted: editedNews.isDeleted,
      createDate: editedNews.createDate,
      updateDate: editedNews.updateDate,
      content: {
        id: editedNews.content?.id,
        mainText: editedNews.content?.mainText,
        title: data.title,
        htmlContent: data.htmlContent,
        fileModels: editedNews.content?.fileModels,
        contentType: editedNews.content?.contentType,
        isDeleted: editedNews.content?.isDeleted,
        createDate: editedNews.content?.createDate,
        updateDate: editedNews.content?.updateDate,
        parentId: editedNews.content?.parentId,
        newsId: editedNews.content?.newsId,
      },
    };
    editNews(news, data.fileModels);
  };

  useEffect(() => {
    document.title = 'Изменение новости - МФ МАДИ'
    getNewsById(params.id);
  }, []);

  const { control, handleSubmit, reset } = useForm({
    mode: "onSubmit",
  });

  return (
    <>
      <section>
        <div className="container">
          <h1 className="admin-title title">Изменение новости</h1>
          {isGetNewsLoading ? (
            <Loader />
          ) : (
            <form
              action="#"
              className="admin-login__form form"
              onSubmit={handleSubmit(onEdit)}
            >
              <label className="form__label">
                <span className="form__text">Заголовок</span>
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
                <span className="form__text">Изображения</span>
                <Controller
                  control={control}
                  name="fileModels"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <input
                      type="file"
                      multiple={true}
                      className={`form__input ${error ? " error" : ""}`}
                      onChange={(newValue) => onChange(newValue.target.files)}
                    />
                  )}
                />
                <div className="form__images">
                  <ul className="form__images-list">
                    {isGetNewsLoading ? (
                      <Loader />
                    ) : (
                      fileModels?.map((imageFile, idx) => (
                        <li
                          key={idx}
                          data-id={imageFile.id}
                          className="form__images-item images-item"
                        >
                          <a
                            href={`${FILES_URL}/${imageFile.name}`}
                            target={"_blank"}
                          >
                            <img
                              src={`${FILES_URL}/${imageFile.name}`}
                              alt=""
                            />
                          </a>
                          <button
                            type="button"
                            className="images-item__remove"
                            onClick={() => {
                              setDeletingImageId(imageFile.id);
                              setModalConfirmDeleteActive(true);
                            }}
                          >
                            <img src={deleteIcon.src} alt="" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </label>
              <label className="form__label">
                <span className="form__text">Контент</span>
                <Controller
                  control={control}
                  name="htmlContent"
                  rules={{
                    required: true,
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <div className={`${error ? "error" : ""}`}>
                      <CKEditorUI
                        initData={value}
                        onChange={(newValue) => {
                          onChange(newValue.editor.getData());
                        }}
                      />
                    </div>
                  )}
                />
              </label>
              <button
                className={`form__btn btn`}
                disabled={isEditLoading || isCreateFileModelLoading}
              >
                {isEditLoading || isCreateFileModelLoading
                  ? "Изменение..."
                  : "Изменить"}
              </button>
            </form>
          )}
        </div>
      </section>
      <Popup
        active={modalConfirmDeleteActive}
        setActive={closeModalConfirmDelete}
      >
        <h2 className="popup__title title">
          Вы действительно хотите удалить фотографию из новости?
        </h2>
        <div className="confirm-buttons">
          <button
            onClick={() => deleteFileModel(deletingImageId)}
            className="confirm-button confirm-button_yes"
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? <Loader isOnlySpinner /> : <span>Да</span>}
          </button>
          <button
            className="confirm-button confirm-button_no"
            onClick={closeModalConfirmDelete}
          >
            Нет
          </button>
        </div>
      </Popup>
    </>
  );
};

export default EditNews;
