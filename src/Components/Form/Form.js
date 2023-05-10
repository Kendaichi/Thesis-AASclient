import React, { useState } from 'react'
import cloud_img from "../../Images/upload.svg"

import { useAuthContext } from '../../Hooks/useAuthContext'
import axios from 'axios'

export default function Form(props) {

    const [ file, setFile ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)

    const { user } = useAuthContext()

    const uploadImage = async (event) => {
        event.preventDefault();
        
        await upload(event);
    }

    const upload = async () => {

        if(!file) return alert("file is empty!") 
        
        let formdata = new FormData();
        formdata.append("image", file);
        // formdata.append("wallet", "0x7Dff7FB730FCee6eaC6740Ab2125714D5c3B0687");
        formdata.append("wallet", props.wallet);

        let bodyContent = formdata;

        let requestOptions = {
            url: `http://localhost:5000/test-upload`,
            method: "POST",
            data: bodyContent,
        }

        await axios.request(requestOptions)
        .then((response) => {
            console.log("Upload Response: ", response.data)
            props.handleClose()
            props.setImageName("")
            props.getImages()

        })
        .catch((error) =>{
            console.log({'error':error})
        })
    }

    const handleFileSelect = (event) => {
        setFile(event.target.files[0])
        props.setImageName(event.target.value.replace(/^.*[\\\/]/, ''))
    }

    return (
        <>
            <form id="upload-form" onSubmit={ uploadImage } style={{ width: "100%", height: "100%" }}>
                <img src={ cloud_img } style={{ marginTop: "20%" }} />
                <p style={{ marginBottom: "15px" }}> { props.imageName ? props.imageName : "Click or Drag image" } </p>
                <input 
                    id="image-input" 
                    onChange={ handleFileSelect } 
                    className="form-control d-sm-flex flex-fill justify-content-sm-center align-items-sm-center" 
                    type="file" 
                    name="image" 
                    style={{ height: "100%", position: "absolute", marginTop: "0px", maxHeight: "100%", padding: "0px" }} 
                    accept="image/*" 
                />
            </form>
        </>
    )
}
