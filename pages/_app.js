import "/components/css/index.css";
import Layout from "/components/layout.js";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const toggleNavbarItems = () => {
      const navbarItem = document.querySelector("#navbar-icon");
      const navbarItems = document.querySelector(".navbar-items");
      const body = document.querySelector("body");

      if (!navbarItems.classList.contains("active")) {
        navbarItem.classList.add("active");
        navbarItems.classList.add("active");
        body.style.overflow = "hidden";
      } else {
        navbarItem.classList.remove("active");
        navbarItems.classList.remove("active");
        body.style.overflow = "visible";
      }
    };

    const navbarIcon = document.querySelector("#navbar-icon");
    if (navbarIcon) {
      navbarIcon.addEventListener("click", toggleNavbarItems);
    }

    return () => {
      if (navbarIcon) {
        navbarIcon.removeEventListener("click", toggleNavbarItems);
      }
    };
  }, []);

  return (
    <Layout>
      <Toaster />
      {router.pathname !== "/" && ( // Conditionally render the menu
        <div className="menu">
          <a href="/admin/notification">Notificações</a>
          <a href="/admin/accounts">Usuários</a>
          <a href="/admin/courses">Cursos</a>
          <a href="/api/v1/auth/signout">Sair</a>
        </div>
      )}
      <Component {...pageProps} />
    </Layout>
  );
}
