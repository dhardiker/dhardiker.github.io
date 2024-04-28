import { PropsWithChildren } from 'react'
import { createApiClient } from "../generated/api/client"
import { ZodiosHooks } from '@zodios/react'

const {
  REACT_APP_API_URL,
} = process.env

if (!REACT_APP_API_URL) throw new Error('REACT_APP_DBS_API_URL is not set')

// Load the Zodios API Client
export const apiClient = createApiClient(REACT_APP_API_URL)

// Expose the API as React Hooks
export const apiClientHooks = new ZodiosHooks('api', apiClient)

const InitApiClient: React.FC<PropsWithChildren> = ({ children }) => {
  // This component isn't really needed, but using it here forces the global exports to be loaded at a certain point in the app lifecycle
  if (process.env.NODE_ENV === 'development') console.log('[InitApiClient] API Client loaded!')

  return <>{children}</>
}

export default InitApiClient
