import React from 'react'
import { useAuthContext } from '../Hooks/useAuthContext'

export default function Profile() {
    const { user } = useAuthContext()

    return (
        <>
            <div class="container-fluid mt-4">
                <h3 class="text-dark mb-4">Profile</h3>
                <div class="row mb-3">
                    <div class="col-lg-4">
                        <div class="card mb-3">
                            <div class="card-body text-center shadow">
                                <img class="rounded-circle mb-3 mt-4" src={ user.picture ? user.picture : "assets\\img\\avatars\\avatar1.jpeg"} width="160" height="160" />
                                <div class="mb-3">{ user.firstname }</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col">
                                <div class="card shadow mb-3">
                                    <div class="card-header py-3">
                                        <p class="text-primary m-0 fw-bold">User Info</p>
                                    </div>
                                    <div class="card-body">
                                        <form>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="email"><strong>Email Address</strong></label>
                                                        <input class="form-control" type="email" placeholder="user@example.com" value={ user.email } disabled={true}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="mb-3"><label class="form-label" for="first_name"><strong>First Name</strong></label>
                                                    <input class="form-control" type="text" value={ user.firstname } disabled={true}/>
                                                </div>
                                                </div>
                                                <div class="col">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="last_name"><strong>Last Name</strong></label>
                                                        <input class="form-control" type="text" value={ user.lastname } disabled={true}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
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
