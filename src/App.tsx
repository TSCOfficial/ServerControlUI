import './App.css'
import { Outlet } from "react-router"
import Header from "./components/Header.tsx";
import Toast from "./components/Toast.tsx";

function App() {

  return (
      <>
          <Header />
          <nav>No content</nav>
          <main>
              <Toast/>
              <Outlet />
          </main>
          <footer>No content</footer>
      </>
  )
}

export default App
