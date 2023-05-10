import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import image from '../Images/dogs/image3.jpeg'
import { useLogin } from "../Hooks/useLogin"

export default function Login() {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const { login, error, isLoading, dispatch, setIsLoading, setError } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }


    return (
        <>
            <div className='container'>
                <div class="row justify-content-center">
                    <div class="col-md-9 col-lg-12 col-xl-10">
                        <div class="card shadow-lg o-hidden border-0 my-5">
                            <div class="card-body p-0">
                                <div class="row">
                                    <div class="col-lg-6 d-none d-lg-flex">
                                        <div class="flex-grow-1 bg-login-image" style={{backgroundImage: `url(${image})`}}></div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="p-5">
                                            <div class="text-center">
                                                <h4 class="text-dark mb-4">Welcome Back!</h4>
                                            </div>
                                            {error ? 
                                                <div class="alert alert-danger" role="alert">
                                                    {error}
                                                </div>
                                                :
                                                null
                                            }
                                            <form id='login' class="user" onSubmit={handleSubmit} autocomplete="off">
                                                <div class="mb-3">
                                                    <input 
                                                        class="form-control form-control-user" 
                                                        type="email" 
                                                        placeholder="Enter Email Address..." 
                                                        name="email" 
                                                        onChange={e => setEmail(e.target.value)}
                                                        required={true}
                                                    />
                                                </div>
                                                <div class="mb-3">
                                                    <input 
                                                        id="exampleInputPassword" 
                                                        class="form-control form-control-user" 
                                                        type="password" 
                                                        placeholder="Password" 
                                                        name="password" 
                                                        onChange={e => setPassword(e.target.value)}
                                                        required={true}
                                                    />
                                                </div>
                                                
                                                <button 
                                                    class="btn btn-primary d-block btn-user w-100" 
                                                    type="submit"
                                                    disabled={isLoading}
                                                    formTarget="login"
                                                >Login
                                                </button>

                                                <hr />

                                            </form>
                                            <div class="text-center"></div>
                                            <div class="text-center">
                                                <NavLink className="nav-link" to="/signup">
                                                    <a class="small">Create an Account!</a>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}
