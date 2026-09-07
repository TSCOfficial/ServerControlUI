import './App.css'
import { Outlet } from "react-router"
import Header from "./components/Header.tsx";
import {ToastProvider} from "./components/ToastContext.tsx";
import Footer from "./components/Footer.tsx";
import Navigation from "./components/Navigation.tsx";

function App() {

  return (
      <>
          <ToastProvider>
              <Header />
              <Navigation/>
              <main>
                  <Outlet />
              </main>
              <Footer/>
          </ToastProvider>
      </>
  )
}

export default App
