import { BrowserRouter, Outlet, Route, Routes, useNavigate } from "react-router-dom"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Blog from "./pages/Blog"
import Home from "./pages/Home"
import Publish from "./pages/Publish"
import { useEffect } from "react"
import TopNav from "./components/TopNav"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes >

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

const Layout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/signin')
    }
  }, [])
  return (
    <div>
      <TopNav />
      <Outlet />
    </div>
  )
}

export default App
