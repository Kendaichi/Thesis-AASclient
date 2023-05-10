import React, { useState } from 'react'
import { Outlet, NavLink } from "react-router-dom"
import { useAuthContext } from '../Hooks/useAuthContext'
import { useLogout } from '../Hooks/useLogout'

import QRCode from "../Components/QRCode";

export default function Layout({ account, connectWallet, disconnectWallet }) {

    // const { user } = useAuthContext()
    // const { logout } = useLogout()

    // const [ dropdownProfile, setdropdownProfile ] = useState("")
    const [ generateQrModal, setGenerateQrModal ] = useState(false)

    // const toggleDropdownProfile = () => {
    //     if (dropdownProfile == "show") {
    //         setdropdownProfile("")
    //     } else {
    //         setdropdownProfile("show")
    //     }
    // }

    // const handleLogout = () => {
    //     logout()
    // }

    return (
            <>
                <div id="wrapper" >

                    <nav className= {"navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 " + {/*this.state.toggle*/}}>
                    
                        <div className="container-fluid d-flex flex-column p-0">

                            <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="/">
                                <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-file-alt"></i></div>
                                <div className="sidebar-brand-text mx-3"><span>Audit</span></div>
                            </a>

                            <hr className="sidebar-divider my-0"/>
                            {/* <!-- Nav Item - Pages Collapse Menu --> */}
                            <ul className="navbar-nav text-light" id="accordionSidebar">

                                {/* <li className="nav-item">

                                    <div className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                        <i className="fas fa-fw fa-cog"></i>
                                        <span>React Blog</span>
                                    </div>

                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                                        <div className="bg-white py-2 collapse-inner rounded">
                                            <h6 className="collapse-header">React Route:</h6>
                                            <a className= {"collapse-item "} to="/"><i className="fas fa-fw fa-cog"></i> Home</a>
                                            <a className= {"collapse-item "} to="/blogs"><i className="fas fa-fw fa-cog"></i> Blogs </a>
                                            <a className= {"collapse-item "} to="/contact"><i className="fas fa-fw fa-cog"></i> Contact </a>
                                        </div>
                                    </div>

                                </li> */}
                                
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/upload">
                                        <i className="fas fa-fw fa-cog"></i> Pendings
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/public">
                                        <i className="fas fa-fw fa-cog"></i> Public
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/audit">
                                        <i className="fas fa-fw fa-cog"></i> Audit
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/viewer">
                                        <i className="fas fa-fw fa-cog"></i> Viewer
                                    </NavLink>
                                </li>
                                

                            </ul>
                        </div>
                    </nav>

                    <div id="content-wrapper" className="d-flex flex-column">

                        <div id="content">

                            <nav className="navbar navbar-light navbar-expand bg-white shadow topbar static-top">
                                <div className="container-fluid">
                                    <ul className="navbar-nav flex-nowrap ms-auto">

                                        {/* Display Account */}
                                        {account ? (

                                            <div className='mt-3'>
                                                <p className='d-inline-block' style={{ marginRight: 5, cursor: "pointer"  }}>Wallet Address: <span onClick={()=> setGenerateQrModal(true) }>{account}</span></p>
                                                <button className={"btn btn-sm btn-danger"} onClick={disconnectWallet}>Disconnect Wallet</button>
                                            </div>
                                                   
                                        ) : (
                                            
                                            <div className='mt-3'>
                                                <button
                                                    className={"btn btn-sm btn-primary"}
                                                    onClick={connectWallet}
                                                >
                                                    Connect wallet
                                                </button>
                                            </div>
                                            
                                        )}

                                        {/* <div className="d-none d-sm-block topbar-divider">
                                        </div> */}
                                        {/* <li className="nav-item dropdown no-arrow">
                                            <div className="nav-item dropdown no-arrow">

                                                <a type='button' className={`dropdown-toggle nav-link ${dropdownProfile}`} onClick={ toggleDropdownProfile }>
                                                    <span className="d-none d-lg-inline me-2 text-gray-600 small"> { user.email } </span>
                                                    <img className="border rounded-circle img-profile" src={ user.picture ? user.picture : "assets\\img\\avatars\\avatar1.jpeg"} />
                                                </a>

                                                <div className={`dropdown-menu shadow dropdown-menu-end animated--grow-in ${dropdownProfile}`}>

                                                    <NavLink className="dropdown-item" to="/profile" onClick={ toggleDropdownProfile }>
                                                        <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> Profile
                                                    </NavLink>

                                                    <div className="dropdown-divider"></div>

                                                    <a className="dropdown-item" onClick={handleLogout}>
                                                        <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> Logout
                                                    </a>

                                                </div>
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                            </nav>

                            <Outlet />
                    
                        </div>

                        <footer className="bg-white sticky-footer">
                            <div className="container my-auto">
                                <div className="text-center my-auto copyright"><span>Copyright © Brand 2023</span></div>
                            </div>
                        </footer>

                    </div>

                    <a className="border rounded d-inline scroll-to-top" href="#page-top"><i className="fas fa-angle-up"></i></a>
                        
                </div>

                <QRCode 
                    account={account}
                    modal={generateQrModal}
                    setModal={setGenerateQrModal}
                />
            
            </>
    )
}
