import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import axios from 'axios'

import { useLocation } from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

export default function Viewer({wallet, contract}) {

    const { state } = useLocation()

    const [imageSrc, setImageSrc] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(1)

    const canvasRef = useRef(null)
    const canvasCropRef = useRef(null)

    const croppedImageRef = useRef(null)

    const [ height, setHeight ] = useState(null)
    const [ width, setWidth ] = useState(null)

    const [isDrawing, setIsDrawing] = useState(false)
    const [startX, setStartX] = useState(null)
    const [startY, setStartY] = useState(null)
    const [endX, setEndX] = useState(null)
    const [endY, setEndY] = useState(null)

    let navigate = useNavigate() 

    // Form Fields that will be inserted to Blockchain
    const [ CID, setCID ] = useState(null)
    const [ OrderNumber, setOrderNumber ] = useState(null)
    const [ Supplier, setSupplier ] = useState(null)
    const [ Receiver, setReceiver ] = useState(null)
    const [ date, setDate ] = useState(null)
    const [ Amount, setAmount ] = useState(null)
    const [ Items, setItems ] = useState([])

    // For File upload
    const [ file, setFile ] = useState(null)

    // IPFS requested response results
    const [ document, setDocument ] = useState(null)
    const [ documentArray, setDocumentArray ] = useState(null)
    const [ documentExtracted, setDocumentExtracted ] = useState(null)
    
    const [ imageUrl, setimageUrl ] = useState(state?.url)
    const [ imageID, setImageID ] = useState(state?.url)

    const [ showModal, setShowModal] = useState(false)
    const handleClose = () => setShowModal(false)
    const handleShow = () => setShowModal(true)

    const [ textExtracted, setTextExtracted ] = useState("")
    const [ assignedTo, setAssignedTo ] = useState("")
    const [ selectedRow, setSelectedRow ] = useState("")
    const [ selectedColumn, setSelectedColumn ] = useState("")

    useEffect(() => {

        setimageUrl(state?.url)
        setImageID(state?.id)

        if(!state?.CID) return

        setCID({CID:state?.CID})
        setOrderNumber(state?.receiptID)
        setSupplier(state?.supplier)
        setReceiver(state?.receiver)
        setDate(new Date(state.date * 1000).toLocaleString(undefined, {
            dateStyle: "medium",
        }))
        setAmount(state?.totalAmount)
        setItems(JSON.parse(state?.items))

    },[])

    useEffect(() => {

        // console.log(imageUrl)

        const init = async () => {

            if(imageUrl === null) return

            
            const response = await fetch(imageUrl)

            // Load image from url and convert it into blob()
            
            // A Blob is an opaque reference to, or handle for, a chunk of data. 
            // The name comes from SQL databases, where it means “Binary Large Object.” In JavaScript, Blobs often represent binary data, 
            // and they can be large, but neither is required: a Blob could also represent the contents of a small text file.
            // Blobs are immutable, and Blobs are usually created by appending to a Blob or File.
            const data = await response.blob()

            // using FileReader to create an image DataURL
            // The JavaScript FileReader is an API that helps developers to access the data of a file. 
            // A FileReader class object provides several methods for reading files, including abort(), readAsArrayBuffer(), 
            // readAsBinaryString(), readAsDataURL(), and readAsText().
            // FileReader objects are created with the FileReader() constructor.

            let reader = new FileReader()
            reader.onload = (event) => {
                console.log(event.target.result)
                const img = new Image()
                try{
                    img.onload = () => {
                        console.log(img)
                        
                        const canvas = canvasRef.current
                        canvas.width = img.width
                        canvas.height = img.height
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(img, 0, 0)
                        setImageSrc(canvas.toDataURL())
            
                        setWidth(img.width)
                        setHeight(img.height)

                        // TEST - convert canvas to base64 image
                        // const base64Image = canvas.toDataURL("image/jpeg", 1);
                        // console.log(base64Image)
            
                    }
                    img.src = event.target.result
                    // alert(event.target.result)
                }catch(err){
                    console.log("error", err)
                }

            }
            reader.readAsDataURL(data)

            const file = new File([data], "image", {
                type: data.type
            })

            // Set state of the file with new file object.
            setFile(file)

            // console.log(file)

        }
        init()

    }, [setimageUrl])


    const handleImageUpload = (event) => {

        // Upload Purposes
        setFile(event.target.files[0])
        console.log("here ", event.target.files[0])

        // // Displaying Image to Canvas Purposes
        // const file = event.target.files[0]
        // const reader = new FileReader()
    
        // reader.onload = (event) => {
        //     const img = new Image()
        //     img.onload = () => {
        //         const canvas = canvasRef.current
        //         canvas.width = img.width
        //         canvas.height = img.height
        //         const ctx = canvas.getContext('2d')
        //         ctx.drawImage(img, 0, 0)
        //         setImageSrc(canvas.toDataURL())
        //         console.log(imageSrc)
        //     }
        //     img.src = event.target.result
        // }
        // reader.readAsDataURL(file)

        // You can delete this and use the top code if you decide to not useRef, ma mind still not understangnism it at this moment
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = new Image()
          img.onload = () => {
            // alert(img)
            const canvas = canvasRef.current
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            setImageSrc(canvas.toDataURL())
            // imageRef.current.src = URL.createObjectURL(file)
            // console.log(imageRef)

            setWidth(img.width)
            setHeight(img.height)

          }
          img.src = event.target.result
          console.log("result", event.target.result)
        }
        reader.readAsDataURL(file)
        // till here.....................
    }


    const uploadImage = async (event) => {
        event.preventDefault()

        if(file == null){
            alert("No file Selected!")
            return
        }else{
            await getCID(event)
            await getOCRValues(event)
        }
    }


    const getCID = async () => {
        let formdata = new FormData()
        formdata.append("image", file)

        let bodyContent =  formdata

        let requestOptions = {
            url: "http://localhost:5000/ipfs-api",
            method: "POST",
            data: bodyContent,
        }

        let response = await axios.request(requestOptions)
        .then((response) => {

            console.log(response.status)
            console.log(response.data)
            setCID(response.data)

        })
        .catch((error) =>{
            alert("An error occured.")
            console.log({'error': error.message})
        })
    }


    const getOCRValues = async () => {
        let formdata = new FormData()
        formdata.append("image", file)

        let bodyContent =  formdata

        let requestOptions = {
            url: "http://localhost:5000/google-api",
            // url: "http://localhost:5000/test-data",
            method: "POST",
            data: bodyContent,
        }

        let response = await axios.request(requestOptions)
        .then((response) => {
            console.log(response.status)
            console.log(response.data)
            setDocument(response.data.document)

        })
        .catch((error) =>{
            console.log({'error':error})
        })
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const img = new Image()
        img.onload = () => {
            canvas.width = img.width * zoomLevel
            canvas.height = img.height * zoomLevel
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            refresh_rectangles(ctx)
        }
        img.src = imageSrc
    }, [imageSrc, zoomLevel, documentArray])

  
    const handleZoomChange = (event) => {
        setZoomLevel(parseFloat(event.target.value))
    }


    const handleMouseDown = (event) => {
        event.preventDefault()
        event.stopPropagation()
        
        setIsDrawing(true)
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        setStartX((event.clientX - rect.left))
        setStartY((event.clientY - rect.top))
    }
    

    const handleMouseMove = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (isDrawing) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const img = new Image()
            const rect = canvas.getBoundingClientRect()

            img.onload = () => {
                canvas.width = img.width * zoomLevel
                canvas.height = img.height * zoomLevel
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                const currentX = (event.clientX - rect.left)
                const currentY = (event.clientY - rect.top)
                const width = currentX - startX
                const height = currentY - startY
                ctx.strokeRect(startX, startY, width, height)
                refresh_rectangles(ctx)
            }
            img.src = imageSrc
        }
    }
    

    const handleMouseUp = (event) => {
        event.preventDefault()
        event.stopPropagation()
        
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        setIsDrawing(false)
        setEndX(event.clientX - rect.left)
        setEndY(event.clientY -  rect.top)
        const currentX = (event.clientX - rect.left)
        const currentY = (event.clientY - rect.top)
        const width = currentX - startX
        const height = currentY - startY
        // prompt("",`Start: (${startX / zoomLevel}, ${startY / zoomLevel})\nEnd: (${endX / zoomLevel}, ${endY / zoomLevel})\nSize: (W: ${width / zoomLevel}, H: ${height / zoomLevel})`)
        cropImage((startX / zoomLevel), (startY / zoomLevel), (width / zoomLevel), (height / zoomLevel))

    }

    const cropImage = (startX, startY, width, height) => {

        let reader = new FileReader()

        reader.onload = (event) => {
            // Create a new image object and load the selected file into it
            var img = new Image()
            img.onload = async function() {

                // console.log(img)
                // Create a new canvas element and context
                const canvas = canvasCropRef.current
                const ctx = canvas.getContext('2d')

                // Set the canvas dimensions to the cropped area
                canvas.width = width
                canvas.height = height

                // Draw the cropped portion of the image onto the canvas
                ctx.drawImage(
                    img, 
                    startX, 
                    startY, 
                    width, 
                    height, 
                    0, 
                    0, 
                    canvas.width, 
                    canvas.height
                )

                // console.log(canvas)

                let testurl = canvas.toDataURL("image")
                // console.log("dataurl", testurl)

                // var testimage = new Image();
                // testimage.src = testurl;
                // console.log(testimage)

                let headersList = {
                    "Accept": "*/*",
                }
                    
                let bodyContent = new FormData();
                bodyContent.append("image", testurl);
                
                let response = await fetch("http://localhost:5000/crop", { 
                    method: "POST",
                    headers: headersList,
                    body: bodyContent,
                });
                
                let data = await response.json();
                // console.log(data);

                // alert(data.text)

                setTextExtracted(data.text)

                // document.body.appendChild(testimage);

                // var newTab = window.open('about:blank','image from canvas');
                // newTab.document.write("<img src='" + testurl + "' alt='from canvas'/>");

                // document.appendChild("<img src='" + testurl + "' alt='from canvas'/>");

                // canvas.toBlob( async (blob) => {
                //     const newImg =  new Image()
                //     const url = URL.createObjectURL(blob);

                //     console.log(url)
                
                //     // newImg.onload = () => {
                //     //     // no longer need to read the blob so it's revoked
                //     //     URL.revokeObjectURL(url);
                //     // };
                
                //     newImg.src = url;

                //     console.log(newImg)

                //     const file = new File([newImg], "imagesss", {
                //         type: "image/png"
                //     })

                //     console.log(file)

                //     let headersList = {
                //         "Accept": "*/*",
                //     }
                    
                //     let bodyContent = new FormData();
                //     bodyContent.append("image", file[0]);
                    
                //     let response = await fetch("http://localhost:5000/crop", { 
                //         method: "POST",
                //         body: bodyContent,
                //         headers: headersList
                //     });
                    
                //     let data = await response.text();
                //     console.log(data);
                // });

                handleShow()
            }

            console.log(event.target.result)

            img.src = event.target.result

        }
        reader.readAsDataURL(file)

    }


    function refresh_rectangles(ctx){
        for (var i in documentArray) {

            let rect = documentArray[i]

            let show = [
                'supplier_name',
                'receiver_name',
                'invoice_date',
                'total_amount',
                'invoice_id'
            ]
            if(show.includes(rect.type)){
                ctx.strokeStyle = "black"
                ctx.lineWidth = 3
                ctx.strokeRect(
                    (rect.startX * zoomLevel), 
                    (rect.startY * zoomLevel), 
                    (( rect.endX - rect.startX ) *zoomLevel), 
                    (( rect.endY - rect.startY ) *zoomLevel)
                )
            }else{
                ctx.strokeStyle = "gray"
                ctx.lineWidth = 1
                ctx.strokeRect(
                    (rect.startX * zoomLevel), 
                    (rect.startY * zoomLevel), 
                    (( rect.endX - rect.startX ) *zoomLevel), 
                    (( rect.endY - rect.startY ) *zoomLevel)
                )
                ctx.strokeStyle = "black"
            }
    
        }
    }


    // Document Ai response processing the json values to get the necessary informations
    useEffect(() => {

        let arr = []
        let data = {
            invoice_id: "",
            supplier_name: "",
            invoice_date: "",
            receiver_name: "",
            total_amount: ""
        }
        document?.entities.map((entity, index) => {
            console.log(entity)
            
            if(entity.pageAnchor != null){
                arr.push({
                    "type" : entity.type, 
                    "text" : entity.mentionText,
                    "confidence": entity.confidence,
                    "normalizedValue" : entity.normalizedValue,
                    "startX": entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[0] ? entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[0].x * width : 0,
                    "startY": entity.pageAnchor.pageRefs [0].boundingPoly?.normalizedVertices[0] ? entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[0].y * height: 0,
                    "endX": entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[2] ? entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[2].x * width: 0,
                    "endY": entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[2] ? entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices[2].y * height: 0,
                })
            }

            if(entity.type == "line_item"){

                let line_properties = entity.properties

                let json = {
                    "quantity": "",
                    "unit": "",
                    "description": "",
                    "unit_price": "",
                    "amount": "",
                }

                // alert(entity.mentionText)
                console.log(entity.properties)
                // setItems(current => [...current, {id: 3, name: 'Carl'}])

                line_properties.forEach(property => {
                    // alert(index + " " + property.type)

                    switch (property.type){
                        case "line_item/quantity" : {
                            json.quantity = property.mentionText
                        } break;
                        case "line_item/unit" : {
                            json.unit = property.mentionText
                        } break;
                        case "line_item/description" : {
                            json.description = property.mentionText
                        } break;
                        case "line_item/unit_price" : {
                            json.unit_price = property.mentionText
                        } break;
                        case "line_item/amount" : {
                            json.amount = property.mentionText
                        } break;
                    }
                });

                setItems(current => [...current, json])


                console.log(Items)
                
            }

            
            if(entity.type == "supplier_name"){
                data.supplier_name = entity.mentionText
                setSupplier(entity.mentionText)

            }else if(entity.type == "invoice_date"){
                data.invoice_date = entity.mentionText
                setDate(entity.mentionText)

            }else if(entity.type == "receiver_name"){
                data.receiver_name = entity.mentionText
                setReceiver(entity.mentionText)
                
            }else if(entity.type == "invoice_id"){
                data.invoice_id = entity.mentionText
                setOrderNumber(entity.mentionText)
                
            }else if(entity.type == "total_amount"){
                data.total_amount = entity.mentionText
                setAmount(entity.mentionText)
                
            }

        })
        console.log(arr)
        console.log(data)

        setDocumentArray(arr)
        setDocumentExtracted(data)

        console.log(documentArray)
        console.log(documentExtracted)

    }, [document])

    // useEffect(() =>{
    //     alert(contract + " " + wallet)
    // }, [])

    const handleAddTransaction  = async (event) => {
        event.preventDefault()

        alert("Add new transaction")

        try {

            // Add Data to blockchain
            const dateUnixTimestamp = new Date(date).getTime() / 1000 // convert date to Unix timestamp

            console.log(JSON.stringify(Items))

            await contract
                .methods
                .addTransaction(
                    Receiver,
                    Supplier,
                    OrderNumber.toString(),
                    Amount.toString(),
                    dateUnixTimestamp,
                    CID?.CID,
                    wallet,
                    JSON.stringify(Items)
                )
                .send({ from: wallet })

            // Delete file from database.
    
            let headersList = {
                "Accept": "*/*",
            }
            
            let response = await fetch(`http://localhost:5000/delete/${imageID}`, { 
                method: "DELETE",
                headers: headersList
            })
            
            let data = await response.json()
            navigate("/upload")

            
        } catch (error) {
            alert("an error occured while adding data to blockchain.")
            console.log(error)
        }
    }
  

    return (
        <>
            <div className="container-fluid" style={{padding: "0px"}}>
                <div className="row" style={{margin: "0px", marginLeft: "0px"}}>

{/* Left side - Canvas and upload */}
                    <div className="col-sm-12 col-md-12 col-lg-8 col-xl-8 col-xxl-8">
                        <div className="row">
                            <div className="col" style={{padding: "0px"}}>

                                {/* Show only when imageSrc is null */}
                                <div style={{width: "100%", height: "100%"}} className={!imageSrc ? '' : 'd-none'}>
                                    <div className="row" style={{ position: "relative", width: "100%", height: "100%", margin: "0px", marginLeft: "0px"}}>
                                        <div className="col text-center" style={{ position: "relative", width: "100%", height: "100%", padding: "0px" }}>
                                            <div 
                                                className="text-center d-sm-flex d-md-flex justify-content-sm-center justify-content-md-center align-items-md-center" 
                                                style={{ position: "relative", borderStyle: "dashed", height: "100vh", borderRadius: "10px"}}
                                            >

                                                <form id="upload-form" onSubmit={ uploadImage } style={{ width: "100%", height: "100%" }}>
                                                    <h1 style={{ marginTop: "50vh" }}>Click or Drag File</h1>
                                                    <input 
                                                        className="form-control d-sm-flex flex-fill justify-content-sm-center align-items-sm-center" 
                                                        type="file" 
                                                        name="image" 
                                                        style={{ height: "100%", position: "absolute", marginTop: "0px", maxHeight: "100%", padding: "0px" }} 
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </form>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Show only when imageSrc is not null */}
                                <div 
                                    className={ imageSrc ? "border-2 border-danger align-items-center align-content-center" : "d-none"}
                                    style={{
                                        maxWidth: "100vw", 
                                        overflow: "scroll", 
                                        background: "#EEEEEE", 
                                        width: "100%", 
                                        maxHeight: "85vh", 
                                        minHeight: "85vh", 
                                    }}
                                >
                                    <div>
                                        <div 
                                            id="box" 
                                            className="box" 
                                            style={{height: "100%"}}
                                        >
                                            <canvas 
                                                id="myCanvas" 
                                                style={{cursor: "crosshair", }} 
                                                ref={canvasRef}
                                                onPointerDown={handleMouseDown}
                                                onPointerMove={handleMouseMove}
                                                onPointerUp={handleMouseUp}
                                            >
                                                Your browser does not support the HTML canvas tag.
                                            </canvas>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={imageSrc ? "row" : "d-none" }>
                            <div className="col">
                                <div className="row">
                                    <div className="col-md-12 pt-3">
                                        
                                        <div className="input-group col-lg-8 col-md-6 col-sm-12">
                                            <button 
                                                className="btn btn-outline-primary" 
                                                type="button"
                                                onClick={ () => zoomLevel > 0.2 ? setZoomLevel(parseFloat( zoomLevel - 0.1 )) : alert("cannot zoom")}

                                            >Zoom Out</button>
                                            <input 
                                                type="range" 
                                                className="form-control form-range"
                                                min="0.1" 
                                                max="2" 
                                                step="0.1" 
                                                value={zoomLevel} 
                                                onChange={handleZoomChange}
                                            />
                                            <button 
                                                className="btn btn-outline-primary" 
                                                type="button" 
                                                onClick={ () => zoomLevel < 2 ? setZoomLevel(parseFloat( zoomLevel + 0.1 )) : alert("cannot zoom")}
                                                >Zoom In </button>

                                            <button className="btn btn-outline-primary" onClick={() => setZoomLevel(1)}>Reset Zoom</button>
                                            <button className="btn btn-outline-primary" onClick={() => handleShow()}>View Extracted</button>
                                            
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
{/* Right side of Web app TABS UI */}
                    <div 
                        className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 justify-content-end" 
                        style={{padding: "0px", background: "var(--bs-white)"}}
                    >
                        <div>
                            <Tabs
                                defaultActiveKey="summary"
                                id="uncontrolled-tab-example"
                                className="mt-1 mb-3"
                            >   

    {/* Summary tab */}
                                <Tab eventKey="summary" className='p-1' title="Block Summary" style={{minHeight: "80vh"}}>

                                    <p className="ps-2 d-none">File ID: {state?.id}</p>
                                    <p className="ps-2 d-none">Filename: {imageUrl?.replace(/^.*[\\\/]/, '')}</p>

                                    <form id='transaction_form' onSubmit={handleAddTransaction}>
                                        <ul id="imageList" className="list-group mb-3" >
                                            <li className="list-group-item">
                                                <label className="form-label">
                                                    <span >
                                                        <strong>IPFS CID (Content Identifier) </strong>
                                                    </span>
                                                </label>
                                                <div className="input-group mb-3">
                                                    <input className="form-control" type="text" value={ CID?.CID } required={true}/>
                                                </div>

                                            </li>
                                        </ul>

                                        <ul id="imageList-1" className="list-group mb-3" >
                                            <li className="list-group-item">
                                                <h5><strong><span >Document Details</span></strong></h5>

                                                <label className="form-label"><span >Receipt / Invoice ID</span></label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" value={ OrderNumber } required={true}/>
                                                </div>
                                                <label className="form-label"><span >Supplier</span></label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" value={ Supplier } required={true}/>
                                                </div>
                                                <label className="form-label"><span >Receiver</span></label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" value={ Receiver } required={true}/>
                                                </div>
                                                <label className="form-label"><span >Date</span></label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" value={ date } required={true}/>
                                                </div>
                                                <label className="form-label"><span >Amount</span></label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" value={ Amount } required={true}/>
                                                </div>
                                            </li>
                                        </ul>

                                        <ul id="imageList-1" className="list-group mb-3" >
                                            <li className="list-group-item">
                                                <h5><strong><span >Items Table</span></strong></h5>

                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>Qty</th>
                                                            <th>Unit</th>
                                                            <th>Item</th>
                                                            <th>Unit Price</th>
                                                            <th>Amount</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                        Items.map((jsonObj, index) => {

                                                            console.log(jsonObj)

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td><input style={{width: "100%"}} type="text" value={jsonObj?.quantity} readOnly /></td>
                                                                    <td><input style={{width: "100%"}} type="text" value={jsonObj?.unit} readOnly /></td>
                                                                    <td><input style={{width: "100%"}} type="text" value={jsonObj?.description} readOnly /></td>
                                                                    <td><input style={{width: "100%"}} type="text" value={jsonObj?.unit_price} readOnly /></td>
                                                                    <td><input style={{width: "100%"}} type="text" value={jsonObj?.amount} readOnly /></td>
                                                                    <td>
                                                                        <button 
                                                                            className={ state?.action == "add" ? 'btn btn-sm btn-danger' : 'd-none' }
                                                                            type="button"
                                                                            value={index}
                                                                            onClick={(event) => {
                                                                                console.log(event.target.value)
                                                                                setItems(current => {
                                                                                    let newItems = current.filter((item, index) => index != 0);
                                                                                    // console.log("----", newItems)
                                                                                    return newItems
                                                                                })
                                                                            }}
                                                                        >-</button>
                                                                    </td>
                                                                </tr>
                                                            )}

                                                        )}
                                                    </tbody>
                                                </table>


                                            </li>
                                        </ul>

                                    </form>
                                    <button className="btn btn-outline-danger ms-2" type='button' onClick={() => navigate(-1)}>Back </button>

                                    <button 
                                        className={ state?.action == "add" ? "btn btn-primary ms-2" : "d-none" }
                                        type="submit" 
                                        form="upload-form" 
                                        disabled={ document && CID ? true : false}
                                    >Generate Block Details</button>

                                    <button className={ state?.action == "add" ? "btn btn-success ms-2" : "d-none" } type="submit" form="transaction_form">Insert Block</button>
                                </Tab>
    {/* Document Ai tab */}
                                <Tab eventKey="document" className='p-1' disabled={ document ? false : true} title="Document Ai">
                                    <div className="card" style={{minHeight: "80vh", maxHeight: "90vh", overflow: "scroll"}}>
                                        <div className="card-body">
                                            <pre className="card-text"> { document ? "document" : "JSON data will be displayed here." } </pre>
                                        </div>
                                    </div>
                                </Tab>
    {/* IPFS tab */}
                                <Tab eventKey="ipfs" className='p-1' disabled={ CID ? false : true} title="IPFS">
                                    <div className="card" style={{minHeight: "80vh"}}>
                                        <div className="card-body">

                                            <ul className="list-group mb-3">
                                                <li className="list-group-item fw-bold">IPFS Content Identifier</li>
                                                <li className="list-group-item"><span>{ CID?.CID ? CID.CID : "CID will display here."}</span></li>
                                            </ul>

                                            <ul className="list-group mb-3">
                                                <li className="list-group-item fw-bold"><span>Gateways:</span></li>
                                                <li className="list-group-item"><a href={CID?.CID ? "https://ipfs.io/ipfs/" + CID?.CID : "#"} target="_blank" className="stretched-link">ipfs.io/ipfs/</a></li>
                                                <li className="list-group-item"><a href={CID?.CID ? "https://dweb.link/ipfs/" + CID?.CID : "#"} target="_blank" className="stretched-link">dweb.link/ipfs/</a></li>
                                                <li className="list-group-item"><a href={CID?.CID ? "https://gateway.pinata.cloud/ipfs/" + CID?.CID : "#"} target="_blank" className="stretched-link">gateway.pinata.cloud/ipfs/</a></li>
                                                <li className="list-group-item"><a href={CID?.CID ? "http://localhost:8080/ipfs/" + CID?.CID : "#"} target="_blank" className="stretched-link">Localhost:8080</a></li>
                                            </ul>

                                            <ul className="list-group">
                                                <li className="list-group-item fw-bold"><span>Public Gateway checker:</span></li>
                                                <li className="list-group-item"><a href={"https://ipfs.github.io/public-gateway-checker/"} target="_blank" className="stretched-link">Open Checker</a></li>
                                                </ul>

                                        </div>
                                    </div>
                                </Tab>

                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            <canvas 
                ref={canvasCropRef}
                style={{display: "none"}}
            >
                Your browser does not support the HTML canvas tag.
            </canvas>
    

            <Modal       
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={ showModal } 
                onHide={ handleClose }
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title>
                        Text Extracted
                    </Modal.Title>
                </Modal.Header> 

                <Modal.Body>
                    <input 
                        className="form-control mb-3" 
                        type="text" 
                        value={ textExtracted } 
                        onChange={(event) => setTextExtracted(event.target.value)}
                    />
                    <select class="form-select" onChange={(event) => setAssignedTo(event.target.value)}>
                        <option selected>Select Field</option>
                        <option value="receipt-id">Receipt No.</option>
                        <option value="supplier">Supplier</option>
                        <option value="receiver">Receiver</option>
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="items">Item Table</option>
                    </select>

                    {
                        assignedTo == "items" ?
                            (
                                <select 
                                    class="form-select mt-3"
                                    onChange={(event) => {
                                        if(event.target.value == "add"){
                                            alert("add!")
                                            setItems(current => [...current, {
                                                invoice_id: "",
                                                supplier_name: "",
                                                invoice_date: "",
                                                receiver_name: "",
                                                total_amount: ""
                                            }
                                        ])
                                        }else{
                                            setSelectedRow(event.target.value)
                                        }
                                    }}>
                                    <option selected>Select Row</option>
                                    {
                                        Items.map(( item, index) => {
                                            return <option value={ index } >Row { index + 1}</option>
                                        })
                                        
                                    }
                                    <option value={"add"}>Add Row</option>
                                </select>
                            )
                            :
                            (
                                ""
                            )
                    }
                    {
                        selectedRow != "" ?
                        
                        (
                            <select 
                                class="form-select mt-3" 
                                onChange={(event) => {
                                    setSelectedColumn(event.target.value)
                                }}>
                                <option selected>Select Column</option>
                                <option value={"quantity"}>Quantity</option>
                                <option value={"unit"}>Unit</option>
                                <option value={"description"}>Description</option>
                                <option value={"unit_price"}>Unit Price</option>
                                <option value={"amount"}>Amount</option>

                            </select>
                        )
                        :
                        (
                            ""
                        )
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 

                        variant="primary" 
                        type="button" 
                        onClick={() => {

                                switch(assignedTo){
                                    case "receipt-id": {
                                            // alert(textExtracted +  " assign to " + assignedTo)
                                            setOrderNumber(textExtracted)
                                            setAssignedTo("")
                                            handleClose()
                                        }
                                        break;
                                    case "supplier": {
                                            // alert(textExtracted +  " assign to " + assignedTo) 
                                            setSupplier(textExtracted)
                                            setAssignedTo("")
                                            handleClose()

                                        }
                                        break;
                                    case "receiver": {
                                            // alert(textExtracted +  " assign to " + assignedTo)
                                            setReceiver(textExtracted)
                                            setAssignedTo("")
                                            handleClose()

                                        } 
                                        break;
                                    case "date": {
                                            // alert(textExtracted +  " assign to " + assignedTo)
                                            setDate(textExtracted)
                                            setAssignedTo("")
                                            handleClose()

                                        }
                                        break;
                                    case "amount": {
                                            // alert(textExtracted +  " assign to " + assignedTo)
                                            setAmount(textExtracted)
                                            setAssignedTo("")
                                            handleClose()

                                        }
                                        break;

                                    case "items": {
                                            alert(textExtracted +  " assign to " + selectedRow + selectedColumn)
                                            setItems(current => {
                                                let newArray = [...current]; //copy the array
                                                newArray[selectedRow][selectedColumn] = textExtracted; //update the value
                                                return newArray; //return new array
                                            })
                                            setAssignedTo("")
                                            setSelectedRow("")
                                            setSelectedColumn("")
                                            handleClose()
                                        }
                                        break;

                                    default: {
                                            alert("Select a field!")
                                            setAssignedTo("")
                                        }

                                }
                            }
                        }

                    > Assign </Button>

                </Modal.Footer>

            </Modal>


        </>
    )
}


