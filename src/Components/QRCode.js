import React from 'react'
import QRCodeGenerator from "qrcode.react"

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function QRCode({ account, modal, setModal }) {

  const handleClose = () => setModal(false)
  
  return (
    <>  
      <Modal       
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={ modal } 
          onHide={ handleClose }
          backdrop="static"
      >
          <Modal.Header>
              <Modal.Title>
                Scan to Connect Mobile Application
              </Modal.Title>
          </Modal.Header> 

          <Modal.Body>

            <QRCodeGenerator size={300} value={account} />

            <center className='mt-4'>{account}</center>

          </Modal.Body>

          <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                  Back
              </Button>
          </Modal.Footer>

      </Modal>
    </>
  )
}
