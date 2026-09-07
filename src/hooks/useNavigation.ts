import { useState, useEffect, useCallback } from "react"

export interface ParsedRoute {
  isDashboard: boolean
  mineSlug: string
  rawPath: string
}

function parsePath(pathname: string): ParsedRoute {
  // Matches /<mine-name>/dash or /<mine-name>/dash/
  const match = pathname.match(/^\/([a-zA-Z0-9_-]+)\/dash\/?$/i)
  if (match) {
    return {
      isDashboard: true,
      mineSlug: match[1].toLowerCase(),
      rawPath: pathname,
    }
  }

  // Matches /dash or /dash/ directly -> defaults to balaghat
  if (pathname === "/dash" || pathname === "/dash/") {
    return {
      isDashboard: true,
      mineSlug: "balaghat",
      rawPath: pathname,
    }
  }

  return {
    isDashboard: false,
    mineSlug: "balaghat",
    rawPath: pathname,
  }
}

export function useNavigation() {
  const [route, setRoute] = useState<ParsedRoute>(() =>
    typeof window !== "undefined" ? parsePath(window.location.pathname) : { isDashboard: false, mineSlug: "balaghat", rawPath: "/" },
  )

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname))
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigateTo = useCallback((path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path)
      setRoute(parsePath(path))
    }
  }, [])

  return {
    ...route,
    navigateTo,
  }
}
