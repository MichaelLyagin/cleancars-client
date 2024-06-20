import ProfileSvg from "@/components/elements/ProfileSvg/ProfileSvg";
import { IWrappedComponentProps } from "@/types/common";
import { forwardRef, useEffect } from "react";
import styles from "../../../styles/profileDropDown/index.module.scss"
import { $user } from '@/context/user'
import { useStore } from "effector-react";
import { logoutFx } from '@/app/api/auth'
import { useRouter } from "next/router";
import { win32 } from "node:path/win32";
import { withClickOutside } from "@/utils/withClickOutside";
import Link from "next/link";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { $mode } from "@/context/mode";
import ProfileSvgDark from "@/components/elements/ProfileSvgDark/ProfileSvgDark";

const ProfileDropDown = forwardRef<HTMLDivElement, IWrappedComponentProps>(({ open, setOpen }, ref) => {
    const user = useStore($user)
    const router = useRouter()
    const { shouldLoadContent } = useRedirectByUserCheck()
    const mode = useStore($mode)

    const handleLogout = async () => {
        await logoutFx('/users/logout')
        router.push('/')
      }

    useEffect(() => {

    },[shouldLoadContent])

    //Функция открытия/закрытия окна
    const toggleProfileDropDown = () => setOpen(!open)

    return(
        <div className={styles.profile} ref={ref}>
            <button className={styles.profile__btn} onClick={toggleProfileDropDown}>
                <span className={styles.profile__span}>
                    {shouldLoadContent ?
                        (mode === 'dark' ? <ProfileSvgDark/> : <ProfileSvg/>) : 
                        <Link href="/" legacyBehavior passHref>
                            <a>
                            {mode === 'dark' ? <ProfileSvgDark/> : <ProfileSvg/>}
                            </a>
                        </Link>
                    }
                </span>
            </button>
            {open && shouldLoadContent && 
                <ul className={styles.profile__dropdown}>
                    <li className={styles.profile__dropdown__user}>
                        <span className={styles.profile__dropdown__username}>{user.username}</span>
                        <span className={styles.profile__dropdown__email}>{user.email}</span></li>
                     <li className={styles.profile__dropdown__orders}>
                        <Link href="/orders" legacyBehavior passHref>
                            <a>
                                Заказы
                            </a>
                        </Link>
                    </li>
                    <li className={styles.profile__dropdown__logout} onClick={handleLogout}>Выйти</li>
                </ul>
            }
        </div>
    )
})

ProfileDropDown.displayName = 'ProfileDropDown'

export default withClickOutside(ProfileDropDown)