import { Outlet, Link } from "react-router-dom"
import slotlyIcon from "../../assets/images/slotly-icon.svg"
import slotlyBg from "../../assets/images/bg.png"
import "./Layout.css"

const Layout = () => {
  return (
    <div className="auth_layout_wrapper">
      <div
        className="auth_layout relative isolate flex min-h-dvh w-full items-center justify-center bg-surface bg-cover bg-center bg-no-repeat px-4 py-4 md:justify-end lg:pr-[12vw]"
        style={{ backgroundImage: `url(${slotlyBg})` }}
      >
        {/* scrim: dims the bg image to 70%, stays behind the card + header */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white/30" />

        {/* topbar: out of the flow, pinned top-left */}
        <header className="absolute left-0 top-0 flex w-full items-center justify-between px-4 py-3 md:px-8 md:py-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={slotlyIcon} alt="" className="h-10 w-10" />
            <span className="font-display text-2xl font-semibold leading-none tracking-tight text-ink">
              Slotly
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/help" className="text-sm font-medium text-ink-secondary hover:text-ink">
              Help
            </Link>
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout