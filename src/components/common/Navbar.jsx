import React, { useEffect, useState, useRef } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath, useLocation } from 'react-router-dom'
import { NavbarLinks } from "../../data/navbar-links"
import { useSelector } from 'react-redux'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { BsChevronDown, BsSearch } from "react-icons/bs"
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { motion, AnimatePresence } from "framer-motion"

// ==================== SHIMMER COMPONENTS ====================

const ShimmerLine = ({ width = "100%", height = "16px", className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-richblack-700 ${className}`}
    style={{ width, height }}
  >
    <div className="shimmer-wave absolute inset-0" />
  </div>
)

const ShimmerCatalogItem = () => (
  <div className="flex items-center gap-3 rounded-xl p-3">
    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-richblack-700">
      <div className="shimmer-wave absolute inset-0" />
    </div>
    <div className="flex flex-1 flex-col gap-2">
      <ShimmerLine width="70%" height="14px" />
      <ShimmerLine width="40%" height="10px" />
    </div>
  </div>
)

const ShimmerNavItem = () => (
  <div className="flex items-center gap-2">
    <ShimmerLine width="80px" height="14px" />
  </div>
)

const ShimmerMobileCatalog = () => (
  <div className="space-y-2 pl-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 rounded-lg p-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-md bg-richblack-700">
          <div className="shimmer-wave absolute inset-0" />
        </div>
        <ShimmerLine width="100px" height="12px" />
      </div>
    ))}
  </div>
)

// ==================== MAIN NAVBAR COMPONENT ====================

const Navbar = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(false)
  const [subLinks, setSubLinks] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const catalogRef = useRef(null)
  const searchRef = useRef(null)

  // Fetch categories
  const fetchSublinks = async () => {
    try {
      setLoading(true)
      const result = await apiConnector("GET", categories.CATEGORIES_API)
      setSubLinks(result.data.data)
    } catch (error) {
      console.log("Could not fetch the category list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSublinks()
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setCatalogOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  // Close catalog dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) {
        setCatalogOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  // Color helpers
  const getCatalogColors = (name) => {
    const colors = [
      "from-blue-500/20 to-blue-600/5",
      "from-purple-500/20 to-purple-600/5",
      "from-emerald-500/20 to-emerald-600/5",
      "from-amber-500/20 to-amber-600/5",
      "from-rose-500/20 to-rose-600/5",
      "from-cyan-500/20 to-cyan-600/5",
    ]
    const iconColors = [
      "text-blue-400",
      "text-purple-400",
      "text-emerald-400",
      "text-amber-400",
      "text-rose-400",
      "text-cyan-400",
    ]
    const idx = name?.charCodeAt(0) % colors.length || 0
    return { bg: colors[idx], icon: iconColors[idx] }
  }

  return (
    <>
      {/* ===== SHIMMER CSS ===== */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-wave::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 20%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.08) 80%,
            transparent 100%
          );
          animation: shimmer 1.8s infinite ease-in-out;
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        .nav-glow {
          animation: glow 2s infinite ease-in-out;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-down {
          animation: slideDown 0.3s ease forwards;
        }

        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FFD60A, #E7C009);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 999px;
        }
        
        .nav-link-hover:hover::after {
          width: 100%;
        }

        .nav-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #FFD60A, #E7C009);
          transform: translateX(-50%);
          border-radius: 999px;
        }

        .glass-morphism {
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .catalog-card {
          transition: all 0.2s ease;
        }
        .catalog-card:hover {
          transform: translateX(4px);
        }

        .mobile-menu-overlay {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
        }

        .gradient-border {
          background: linear-gradient(135deg, rgba(255, 214, 10, 0.3), rgba(71, 164, 255, 0.3));
        }

        .cart-badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-morphism shadow-lg shadow-black/20 border-b border-richblack-700/50"
            : "bg-richblack-900/95 border-b border-richblack-800"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-maxContent items-center justify-between px-4 lg:px-6">
          
          {/* ===== LOGO ===== */}
          <Link to="/" className="relative z-50 flex-shrink-0 group">
            <motion.img
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              src={logo}
              alt="Logo"
              width={130}
              loading="lazy"
              className="transition-all duration-300 group-hover:brightness-110 sm:w-[130px] w-[100px]"
            />
          </Link>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <ul className="hidden lg:flex items-center gap-x-1">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  // Catalog Dropdown
                  <div
                    ref={catalogRef}
                    className="relative"
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <button
                      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-50 nav-active"
                          : "text-richblack-25 hover:text-richblack-5"
                      } nav-link-hover`}
                    >
                      <span>{link.title}</span>
                      <BsChevronDown
                        className={`text-xs transition-transform duration-300 ${
                          catalogOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Catalog Dropdown Panel */}
                    <AnimatePresence>
                      {catalogOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-1/2 top-full z-[1000] mt-2 w-[320px] -translate-x-1/2"
                        >
                          {/* Arrow */}
                          <div className="flex justify-center -mb-2">
                            <div className="h-4 w-4 rotate-45 rounded-sm bg-richblack-800 border-l border-t border-richblack-600/50" />
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-richblack-600/30 bg-richblack-800 shadow-2xl shadow-black/40">
                            {/* Header */}
                            <div className="border-b border-richblack-700/50 bg-gradient-to-r from-richblack-800 to-richblack-700 px-5 py-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-richblack-300">
                                Browse Categories
                              </p>
                            </div>

                            {/* Links */}
                            <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                              {loading ? (
                                <div className="space-y-1 p-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <ShimmerCatalogItem key={i} />
                                  ))}
                                </div>
                              ) : subLinks.length > 0 ? (
                                subLinks.map((subLink, i) => {
                                  const colors = getCatalogColors(subLink.name)
                                  return (
                                    <Link
                                      to={`catalog/${subLink.name
                                        .split(" ")
                                        .join("-")
                                        .toLowerCase()}`}
                                      key={i}
                                      className="catalog-card flex items-center gap-3 rounded-xl p-3 hover:bg-richblack-700/50 transition-all duration-200 group/item"
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-richblack-5 group-hover/item:text-yellow-50 transition-colors duration-200">
                                          {subLink.name}
                                        </span>
                                        <span className="text-xs text-richblack-400">
                                          Explore courses →
                                        </span>
                                      </div>
                                    </Link>
                                  )
                                })
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-richblack-400">
                                  <div className="mb-2 text-3xl">📚</div>
                                  <p className="text-sm font-medium">No categories found</p>
                                  <p className="text-xs">Check back later!</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Nav Link
                  <Link to={link?.path}>
                    <span
                      className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 inline-block ${
                        matchRoute(link?.path)
                          ? "text-yellow-50 nav-active"
                          : "text-richblack-25 hover:text-richblack-5"
                      } nav-link-hover`}
                    >
                      {link.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ===== RIGHT SECTION (Desktop) ===== */}
          <div className="hidden lg:flex items-center gap-x-3">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="relative rounded-full p-2 text-richblack-200 hover:bg-richblack-700/50 hover:text-richblack-5 transition-all duration-300"
            >
              <BsSearch className="text-lg" />
            </motion.button>

            {/* Cart */}
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-full p-2 text-richblack-200 hover:bg-richblack-700/50 hover:text-richblack-5 transition-all duration-300"
                >
                  <AiOutlineShoppingCart className="text-xl" />
                </motion.div>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="cart-badge absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-[10px] font-bold text-richblack-900 shadow-lg shadow-yellow-500/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {/* Divider */}
            <div className="h-6 w-px bg-richblack-700" />

            {/* Auth Buttons */}
            {token === null && (
              <div className="flex items-center gap-x-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg border border-richblack-600 bg-richblack-800 px-4 py-1.5 text-sm font-medium text-richblack-100 transition-all duration-300 hover:border-richblack-500 hover:bg-richblack-700 hover:text-richblack-5"
                  >
                    Log in
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 px-4 py-1.5 text-sm font-semibold text-richblack-900 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 hover:from-yellow-100 hover:to-yellow-200"
                  >
                    Sign up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Profile */}
            {token !== null && <ProfileDropDown />}
          </div>

          {/* ===== MOBILE RIGHT SECTION ===== */}
          <div className="flex items-center gap-x-3 lg:hidden">
            {/* Mobile Cart */}
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative">
                <div className="rounded-full p-2 text-richblack-200 hover:bg-richblack-700/50 transition-all">
                  <AiOutlineShoppingCart className="text-xl" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-[10px] font-bold text-richblack-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Profile */}
            {token !== null && <ProfileDropDown />}

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative z-50 rounded-lg p-2 text-richblack-200 hover:bg-richblack-700/50 transition-all"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AiOutlineClose className="text-2xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineMenuAlt3 className="text-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ===== SEARCH BAR (Desktop) ===== */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-richblack-700/50"
            >
              <div className="mx-auto max-w-maxContent px-6 py-3">
                <div className="relative">
                  <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400" />
                  <input
                    type="text"
                    placeholder="Search for courses, categories, instructors..."
                    autoFocus
                    className="w-full rounded-xl border border-richblack-600 bg-richblack-800 py-2.5 pl-11 pr-4 text-sm text-richblack-5 placeholder:text-richblack-400 focus:border-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-50/50 transition-all"
                  />
                  <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-richblack-600 bg-richblack-700 px-2 py-0.5 text-xs text-richblack-400">
                    ESC
                  </kbd>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-menu-overlay fixed inset-0 z-40 lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-40 h-full w-[85%] max-w-[380px] overflow-y-auto bg-richblack-900 border-l border-richblack-700/50 shadow-2xl shadow-black/50 lg:hidden"
            >
              <div className="flex flex-col pt-20 pb-8 px-6">
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full rounded-xl border border-richblack-700 bg-richblack-800 py-2.5 pl-10 pr-4 text-sm text-richblack-5 placeholder:text-richblack-400 focus:border-yellow-50 focus:outline-none transition-all"
                  />
                </div>

                {/* Gradient divider */}
                <div className="gradient-border h-px w-full mb-6 rounded-full" />

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {NavbarLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.title === "Catalog" ? (
                        <div>
                          <button
                            onClick={() => setCatalogOpen(!catalogOpen)}
                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                              matchRoute("/catalog/:catalogName")
                                ? "bg-yellow-50/10 text-yellow-50"
                                : "text-richblack-25 hover:bg-richblack-800"
                            }`}
                          >
                            <span>{link.title}</span>
                            <BsChevronDown
                              className={`text-sm transition-transform duration-300 ${
                                catalogOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {catalogOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-richblack-700 pl-4 py-2">
                                  {loading ? (
                                    <ShimmerMobileCatalog />
                                  ) : subLinks.length > 0 ? (
                                    subLinks.map((subLink, i) => {
                                      const colors = getCatalogColors(subLink.name)
                                      return (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.05 }}
                                        >
                                          <Link
                                            to={`catalog/${subLink.name
                                              .split(" ")
                                              .join("-")
                                              .toLowerCase()}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-richblack-800 transition-all group"
                                          >
                                            <span className="text-sm text-richblack-100 group-hover:text-richblack-5 transition-colors">
                                              {subLink.name}
                                            </span>
                                          </Link>
                                        </motion.div>
                                      )
                                    })
                                  ) : (
                                    <p className="py-4 text-center text-sm text-richblack-400">
                                      No categories found
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={link?.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                            matchRoute(link?.path)
                              ? "bg-yellow-50/10 text-yellow-50"
                              : "text-richblack-25 hover:bg-richblack-800"
                          }`}
                        >
                          {link.title}
                          {matchRoute(link?.path) && (
                            <div className="ml-auto h-2 w-2 rounded-full bg-yellow-50" />
                          )}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Gradient divider */}
                <div className="gradient-border h-px w-full my-6 rounded-full" />

                {/* Mobile Auth Buttons */}
                {token === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className="w-full rounded-xl border border-richblack-600 bg-richblack-800 py-3 text-sm font-medium text-richblack-100 transition-all duration-300 hover:border-richblack-500 hover:bg-richblack-700 hover:text-richblack-5">
                        Log in
                      </button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className="w-full rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 py-3 text-sm font-semibold text-richblack-900 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                        Create free account
                      </button>
                    </Link>
                  </motion.div>
                )}

                {/* Mobile Footer Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto pt-8"
                >
                  <div className="rounded-xl border border-richblack-700/50 bg-richblack-800/50 p-4">
                    <p className="text-xs text-richblack-400 leading-relaxed">
                      🎓 Join thousands of learners mastering new skills every day.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-14" />
    </>
  )
}

export default Navbar