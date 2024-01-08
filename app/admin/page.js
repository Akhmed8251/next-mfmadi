"use client"

import { useEffect } from "react";
import getLocalStorage from "../../storage";

const AdminMain = () => {
  const { employeeName } = getLocalStorage()
  useEffect(() => {
    document.title = "Панель администратора - МФ МАДИ"
  }, [])
  
  return (
    <section>
      <div className="container">
        <h1 className="title">Добро пожаловать, {employeeName}</h1>
      </div>
    </section>
  );
};

export default AdminMain;
