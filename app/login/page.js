"use client";

import { useFetching } from "../../hooks/useFetching";
import { Controller, useForm } from "react-hook-form";
import AuthService from "../../api/AuthService";
import getLocalStorage from "../../storage";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";
import { useEffect } from "react";

const Header = dynamic(() => import('@/components/Header'), { ssr: true, loading: () => <Loader/> })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true, loading: () => <Loader/> })

const Login = () => {
  const router = useRouter();
  const {
    setIsAuth,
    setEmployeeName,
  } = getLocalStorage();

  const [authUser, isAuthLoading, authErr] = useFetching(
    async (login, password) => {
      const response = await AuthService.login(login, password);
      if (response.status == 200) {
        setIsAuth(true);
        setEmployeeName(`${response.data.employeeDto.employeeName}`);

        router.push("/admin")
      }
    }
  );

  const { control, handleSubmit } = useForm({
    mode: "onSubmit",
  });

  const login = (data) => {
    authUser(data.login, data.password);
  };

  useEffect(() => {
    document.title = "Авторизация - МФ МАДИ";
  }, [])

  return (
    <>
      <Header />
      <section className="admin-login">
        <div className="container">
          <div className="admin-login__content">
            <h1 className="admin-title title">Авторизация</h1>
            <form
              action="#"
              className="admin-login__form form"
              onSubmit={handleSubmit(login)}
            >
              <label className="form__label">
                <span className="form__text">Имя пользователя</span>
                <Controller
                  control={control}
                  name="login"
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
                <span className="form__text">Пароль</span>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <input
                      type="password"
                      className={`form__input ${error ? " error" : ""}`}
                      onChange={(newValue) => onChange(newValue)}
                    />
                  )}
                />
              </label>
              <button
                className={`form__btn btn${isAuthLoading ? " disable" : ""}`}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? "Вход..." : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
