import './App.css'
import { Outlet } from "react-router"
import Header from "./components/Header.tsx";
import Toast from "./components/Toast.tsx";

function App() {

  return (
      <>
          <Header />
          <main>
              <Toast/>
              <Outlet />
          </main>
      </>
  )
}

export default App
