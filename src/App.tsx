import './App.css'
import { Outlet } from "react-router"
import Header from "./components/Header.tsx";
import {ToastProvider} from "./components/ToastContext.tsx";

function App() {

  return (
      <>
          <ToastProvider>
              <Header />
              <nav>No content</nav>
              <main>
                  <Outlet />
              </main>
              <footer>No content</footer>
          </ToastProvider>
      </>
  )
}

export default App
