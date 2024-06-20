import { checkUserAuthFx } from '@/app/api/auth'
import { setUser } from '@/context/user'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const useRedirectByUserCheck = () => {
  const [shouldLoadContent, setShouldLoadContent] = useState(false)
  const router = useRouter()
  const shouldCheckAuth = useRef(true) //Нужен для обхода двойного рендера при режиме разработки

  useEffect(() => {
    if (shouldCheckAuth.current) {
      shouldCheckAuth.current = false
      checkUser()
    }
  }, [])

  const checkUser = async () => {
    const user = await checkUserAuthFx('/users/login-check')

    if (!user) {
        setShouldLoadContent(false)
        return
    } else {
        setUser(user)
        setShouldLoadContent(true)
        return
    }
  }

  return { shouldLoadContent }
}

export default useRedirectByUserCheck