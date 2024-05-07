import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useLocation } from "react-router-dom"

const Devtools: React.FC = () => {
  const location = useLocation()
  const showDevTools = new URLSearchParams(location.search).has('devtools')
  if (!showDevTools) return null

  return <ReactQueryDevtools initialIsOpen={false} />
}

export default Devtools
