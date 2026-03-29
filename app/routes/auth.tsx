import React, { useEffect } from 'react'
import { usePuterStore } from "~/lib/puter"
import { useLocation, useNavigate } from "react-router"

export const meta = () => ([
    { title: 'Rescheck | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth: () => React.JSX.Element = () => {
    const { isLoading, auth } = usePuterStore()

    const location = useLocation()
    const navigate = useNavigate()

    // safer way to get ?next=
    const params = new URLSearchParams(location.search)
    const next = params.get("next") || "/"

    useEffect(() => {
        if (auth?.isAuthenticated) {
            navigate(next)
        }
    }, [auth?.isAuthenticated, next, navigate])

    return (
        <main className="bg-[url('/image/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">

                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log Into Your Account to Start</h2>
                    </div>

                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing In</p>
                            </button>
                        ) : (
                            <>
                                {auth?.isAuthenticated ? (
                                    <button
                                        className="auth-button"
                                        onClick={auth.signOut}
                                    >
                                        <p>Log Out</p>
                                    </button>
                                ) : (
                                    <button
                                        className="auth-button"
                                        onClick={auth.signIn}
                                    >
                                        <p>Sign In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                </section>
            </div>
        </main>
    )
}

export default Auth