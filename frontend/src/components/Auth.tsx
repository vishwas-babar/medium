import { LoginUserInput, SignupUserInput } from '@vishwas-babar/medium-common';
import axios from 'axios';
import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config';

const Auth = ({ authType }: { authType: "signin" | "signup" }) => {

    const navigate = useNavigate();

    const [signinUserInputData, setSigninUserInputData] = useState<LoginUserInput>({
        email: "",
        password: ""
    })
    const [signupUserInputData, setSignupUserInputData] = useState<SignupUserInput>({
        email: "",
        password: "",
        name: ""
    })

    useEffect(() => {
        console.table(signinUserInputData)

    }, [signinUserInputData])

    async function signInUserSubmit() {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/signin`, signinUserInputData);

            if (response.data) {
                const jwt = response.data.token;
                localStorage.setItem('token', jwt);
                navigate('/')
            }
        } catch (error) {
            alert('please try again later!')
        }
    }
    async function signupUserSubmit() {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/signup`, signupUserInputData);

            if (response.data) {
                const jwt = response.data.token;
                localStorage.setItem('token', jwt);
                navigate('/')
            }
        } catch (error) {
            alert('please try again later!')
        }
    }

    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <div className=' w-92 p-3 h-fit pb-8  shadow-lg border border-spacing-1 border-gray-400 rounded-md '>
                <h2 className='w-full flex justify-center mt-3 text-3xl  font-bold'>
                    {authType === 'signin' ? "Login in your account" : "Create Your account"}
                </h2>
                <p className='w-full font-normal text-slate-400 flex justify-start mt-1'>
                    {authType === "signin" ? "Don't have an account?" : "Already have an accont"}
                    <Link className='ml-1 underline ' to={authType === "signin" ? "/signup" : "/signin"}>{authType === "signin" ? "signup" : "signin"}</Link>
                </p>


                <div className='w-full flex flex-col gap-4 mt-5'>{
                    authType === 'signin' ?
                        (<>
                            <AuthInput inputType='email' label='email' placeholder='' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSigninUserInputData(prev => {
                                    return {
                                        ...prev,
                                        email: e.target.value
                                    }
                                })
                            }} />
                            <AuthInput inputType='password' label='password' placeholder='' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setSigninUserInputData(prev => {
                                    return {
                                        ...prev,
                                        password: e.target.value
                                    }
                                })
                            }} /></>) : (
                            // this is signup components
                            <>
                                <AuthInput inputType='text' label='name' placeholder='' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setSignupUserInputData(prev => {
                                        return {
                                            ...prev,
                                            name: e.target.value
                                        }
                                    })
                                }} />
                                <AuthInput inputType='email' label='email' placeholder='' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setSignupUserInputData(prev => {
                                        return {
                                            ...prev,
                                            email: e.target.value
                                        }
                                    })
                                }} />
                                <AuthInput inputType='password' label='password' placeholder='' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setSignupUserInputData(prev => {
                                        return {
                                            ...prev,
                                            password: e.target.value
                                        }
                                    })
                                }} />
                            </>
                        )}

                    <button
                        className="align-middle w-full select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                        onClick={authType === 'signin' ? signInUserSubmit : signupUserSubmit}
                    >
                        {authType === 'signin' ? "sign in" : "sign up"}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface authInputType {
    label: string;
    inputType: "text" | "password" | "email";
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput = ({ label, inputType, placeholder, onChange }: authInputType) => {

    return (
        <>
            <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                    <input
                        onChange={onChange}
                        type={inputType}
                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-[16px] px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                        placeholder={placeholder} />
                    <label
                        className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 text-[14px] peer-focus:after:!border-gray-900">{label}
                    </label>
                </div>
            </div>
        </>
    )
}

export default Auth