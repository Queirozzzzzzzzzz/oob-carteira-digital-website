import Head from "/components/head.js";

export default function Layout({ children }) {
  return (
    <>
      <Head />
      <main>
        <div className="container">{children}</div>
      </main>
    </>
  );
}
