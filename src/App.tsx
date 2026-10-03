import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import NotFound from "./components/global/NotFound"

//* AUTH
import AuthLayout from "./features/Auth/Layout"
import Register from "./features/Auth/pages/Register"
import Login from "./features/Auth/pages/Login"
import Passreset from "./features/Auth/pages/Passreset"

//* MARKETING
import MarketingLayout from "./features/Home/layout"
import LandingPage from "./features/Home/pages/LandingPage"
import Pricing from "./features/Home/pages/Pricing"
import Contact from "./features/Home/pages/Contact"
import CreateBusiness from "./features/Home/pages/CreateBusiness"

//* OWNER
import OwnerLayout from "./features/owner/layout"
import Dashboard from "./features/owner/pages/Dashboard"
import Workspace from "./features/owner/pages/Workspace"

//* STORE
import StorePageLayout from "./features/Store/Layout"
import Home from "./features/Store/pages/Home"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="signup" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="pass-reset" element={<Passreset />} />
          </Route>

          <Route path="/" element={<MarketingLayout />} >
            <Route index element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/create-business" element={<CreateBusiness />} />
          </Route>

          <Route path="/dashboard" element={<OwnerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workspace" element={<Workspace />} />
          </Route>

          <Route path="/:slug" element={<StorePageLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App