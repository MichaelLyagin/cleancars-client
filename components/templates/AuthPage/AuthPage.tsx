import SignInForm from "@/components/modules/AuthPage/SignInForm";
import SignUpForm from "@/components/modules/AuthPage/SignUpForm";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import styles from '../../../styles/auth/index.module.scss'
import { useRouter } from "next/router";
import { useState } from "react";

const AuthPage = () => {
    const [registrationStatus, setRegistrationStatus] = useState(false);
    const { shouldLoadContent } = useRedirectByUserCheck()
    const router = useRouter();

    const changeRegistrationStatus = () =>{
        setRegistrationStatus(registrationStatus => !registrationStatus);
    }

    if(shouldLoadContent){
        router.push('/main')
        return
    } 

    return(
        <div className={`container ${styles.auth}`}>
            {registrationStatus ? 
                <div className={styles.auth__container}>
                    <SignUpForm switchForm={changeRegistrationStatus} />
                    <button className={styles.auth__container__btn} onClick={changeRegistrationStatus} style={{margin: "10px"}}>
                        Я уже зарегистрирован
                    </button>
                </div>
                :
                <div className={styles.auth__container}>
                    <SignInForm />
                    <button className={styles.auth__container__btn} onClick={changeRegistrationStatus} style={{margin: "10px"}}>
                        Зарегистрироваться
                    </button>
                </div> 
                }
                <div>
            </div>
        </div>
    )
}

export default AuthPage;