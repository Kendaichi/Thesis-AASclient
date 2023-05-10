import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Form from '../Components/Form/Form'

// import { useAuthContext } from '../Hooks/useAuthContext'

import axios from 'axios'

export default function Upload({wallet}) {

    const [ images, setImages ] = useState([])
    const [ imageName, setImageName ] = useState("")
    const [ isLoading, setLoading ] = useState(true)
    const [ showModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false)
    const handleShow = () => setShowModal(true)

    // const { user } = useAuthContext()

    let navigate = useNavigate() 
    let rows

    const getImages = async () => {

        setLoading(true)

        try {

            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json" 
            }

            let reqOptions = {
                url: `http://localhost:5000/test-images?wallet=${wallet}`,
                // Testing wallet
                // url: `http://localhost:5000/test-images?wallet=${"0x7Dff7FB730FCee6eaC6740Ab2125714D5c3B0687"}`,
                method: "GET",
                headers: headersList,
            }
              
            let response = await axios.request(reqOptions)
            
            const json = await response.data.images
            setImages(json)
            
        } catch (error) {
            console.error(error)

        } finally {
            setLoading(false)
        }
    } 


    useEffect(() =>{
        // Fetch Images from Server
        getImages()
    }, [wallet])

    const handleRedirect = (event) => {
        let url = event.target.value
        let id = event.target.id
        // console.log(url)
        alert("add")
        navigate("/viewer", {
            state: {
                url: url,
                id: id,
                action: "add"
            }
        })
    }

    const handleDelete = async (event) => {
        let value = event.target.value

        alert(value)

        let headersList = {
            "Accept": "*/*",
        }
        
        let response = await fetch(`http://localhost:5000/delete/${value}`, { 
            method: "DELETE",
            headers: headersList
        })
        
        let data = await response.json()

        console.log("Delete Row ", data)

        getImages()
    }
    
    
    if(isLoading){

        rows = (
            <tr>
                <td className='text-center align-middle' colSpan={5} style={{height: "500px"}}>    
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </td>
            </tr>
        )

    }else{

        if(images.length === 0){
            rows = (
                <tr>
                    <td>    
                        <span>No Upload</span>
                    </td>
                </tr>
            )
        }else{
            rows = images.map((image, index) => {
                return (
                    <tr key={index} style={{cursor: "pointer"}}>
                        <td style={{width: 50 + "px", maxWidth: 50 + "px"}} >{index}</td>
                        <td style={{width: 50 + "px", maxWidth: 50 + "px"}} > 
                            <img src={`http://localhost:5000/` + image?.filepath} style={{ height: "50px", width: "50px"}} />
                        </td>
                        <td> <span className='ms-3'>{image?.filepath.replace(/^.*[\\\/]/, '')}</span></td>
                        <td>
                            <button 
                                className='btn btn-sm btn-danger me-3' 
                                value={image?._id}
                                onClick = { handleDelete }
                            > Delete </button>
                            <button 
                                className='btn btn-sm btn-primary' 
                                value={ `http://localhost:5000/` + image?.filepath } 
                                id={ image?._id }
                                onClick = { handleRedirect }
                            > Process </button>
                        </td>
                    </tr>
                )
            })
        }
    }
     

    return (
        <>
            <div className="card shadow" style={{margin: "24px"}}>
                <div className="card-header d-flex d-lg-flex py-3">
                    <Button variant="primary" onClick={ handleShow }>
                        Upload
                    </Button>
                </div>
                <div className="card-body p-3">
                    <div>
                        <h3 className='ms-3'>Pending Files</h3>
                    </div>
                    <div className="table-responsive table mt-2" role="grid" aria-describedby="dataTable_info">
                        <table id="receipt-table" className="table my-0 table-hover">
                            <tbody id="table-body">
                                { rows }
                            </tbody>
                            <tfoot>
                                <tr></tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-md-6 align-self-center">
                        </div>
                        <div className="col-md-6">
                            <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className="page-item disabled"><a className="page-link" aria-label="Previous" href="#"><span aria-hidden="true">«</span></a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" aria-label="Next" href="#"><span aria-hidden="true">»</span></a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                </div>
            </div>

            <Modal       
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={ showModal } 
                onHide={ handleClose }
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title>
                        UPLOAD
                    </Modal.Title>
                </Modal.Header> 

                <Modal.Body>

                    <div style={{width: "100%", height: "100%"}}>
                        <div className="row" style={{ position: "relative", width: "100%", height: "100%", margin: "0px", marginLeft: "0px"}}>
                            <div className="col text-center" style={{ position: "relative", width: "100%", height: "100%", padding: "0px" }}>
                                <div className="text-center d-sm-flex d-md-flex justify-content-sm-center justify-content-md-center align-items-md-center" style={{ position: "relative", borderStyle: "dashed", height: "300px"}}>
                                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                        
                                        <Form
                                            imageName = {imageName} 
                                            setImageName = {setImageName}
                                            handleClose = {handleClose}
                                            getImages = {getImages}
                                            wallet = {wallet}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" form="upload-form">
                        Upload
                    </Button>
                </Modal.Footer>

            </Modal>

        </>
    )
}
