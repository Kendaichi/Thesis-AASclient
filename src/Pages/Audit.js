import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink } from 'react-router-dom'

import { PDFDownloadLink } from "@react-pdf/renderer"
import PDFFile from "../Components/PDFGeneration/PDFFile"

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function Audit({ account, contract }) {

    const [transactions, setTransactions] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [filtered, setFiltered] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    
    const [ showModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false)
    const handleShow = () => setShowModal(true)
    
    const transactionPerPage = 3
    const lastTransactionIndex = currentPage * transactionPerPage
    const firstTransactionIndex = lastTransactionIndex - transactionPerPage

    let sortDirection = 1
    let currentPosts = transactions.slice(
        firstTransactionIndex,
        lastTransactionIndex
    )

    let navigate = useNavigate() 
    
    useEffect(() => {
        const fetchTransaction = async () => {
            if (account) {
                const getTransactions = await contract.methods
                    .getTransactionsBySender(account)
                    .call()
                const reversedList = [...getTransactions].reverse()
                setTransactions(reversedList)
            }
        }
  
        const fetchFilteredTransactionByDate = async () => {
            if (!startDate || !endDate || !account) {
                return
            }

            const startTimestamp = new Date(startDate).getTime() / 1000
            const endTimestamp = new Date(endDate).getTime() / 1000
    
            const getFilteredTransaction = await contract.methods
            .getTransactionsByDateAndSender(startTimestamp, endTimestamp, account)
            .call()
    
            const sortedTransactions = [...getFilteredTransaction].sort(
                (a, b) => a.date - b.date
            )
    
            if (JSON.stringify(sortedTransactions) !== JSON.stringify(filtered)) {
                setFiltered(sortedTransactions)
            }
        }
    
        if (contract) {
            fetchTransaction()
        }
    
        if (startDate && endDate) {
            fetchFilteredTransactionByDate()
        }

    }, [contract, account, startDate, endDate, filtered])

    const handleSortByDate = async () => {
        const getTransactions = await contract.methods
            .getTransactionsBySender(account)
            .call()
        const sortedTransactions = [...getTransactions].sort((a, b) =>
            sortDirection === 1 ? a.date - b.date : b.date - a.date
        )
        const reversedList = [...sortedTransactions].reverse()
        setTransactions(reversedList)
    }

    const handleRedirect = (data) => {
        navigate("/viewer", {
            state: data
        })
    }

    return (
        <>
            <div class="card shadow-none">
                <div class="card-header py-3">
                    <h3 class="text-dark">Audit</h3> 
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 text-nowrap">
                            <button class="btn btn-outline-primary me-3" onClick={handleSortByDate} role="button">Sort by date</button> 
                            <button class="btn btn-success" role="button" onClick={ handleShow }>Generate Liquidition Report</button> 

                        </div>
                        <div class="col-md-6">
                            {/* <div id="dataTable_filter" class="text-md-end dataTables_filter"><label class="form-label"><input class="form-control form-control-sm" type="search" aria-controls="dataTable" placeholder="Search" /></label></div> */}
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Receiver</th>
                                    <th>Date</th>
                                    <th>CID</th>
                                    <th>Amount</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {transactions.map((transaction) => (

                                    <tr key={transaction.id}>
                                        <td>
                                            {transaction.seller}
                                        </td>
                                        <td>
                                            {transaction.buyer}
                                        </td>
                                        <td>
                                            {
                                                new Date(transaction.date * 1000).toLocaleString(undefined, {
                                                    dateStyle: "medium",
                                                })
                                            }
                                        </td>
                                        <td>
                                            <a href={"http://Localhost:8080/ipfs/" + transaction.cid} target="_blank">{transaction.cid}</a>
                                        </td>
                                        <td>
                                            PHP {parseFloat(transaction.total).toFixed(2)}
                                        </td>
                                        <td>
                                            <button 
                                                className='btn btn-sm btn-primary' 
                                                onClick = { 
                                                    () => handleRedirect({
                                                            url: ("http://Localhost:8080/ipfs/" + transaction.cid),
                                                            CID: (transaction.cid),
                                                            date: (transaction.date),
                                                            receiver: (transaction.buyer),
                                                            supplier: (transaction.seller),
                                                            receiptID: (transaction.ornumber),
                                                            totalAmount: (transaction.total),
                                                            id: (transaction.id),
                                                            items: (transaction.items)
                                                    }) 
                                                }
                                            > View </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                            <tfoot>
                                <tr></tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-md-6 align-self-center">
                            {/* <p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Showing 1 to 10 of 27</p> */}
                        </div>
                        <div class="col-md-6">
                            <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                <ul class="pagination">
                                    <li class="page-item disabled"><a class="page-link" aria-label="Previous" href="#"><span aria-hidden="true">«</span></a></li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item"><a class="page-link" aria-label="Next" href="#"><span aria-hidden="true">»</span></a></li>
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
                        Generate Liquidation Report
                    </Modal.Title>
                </Modal.Header> 

                <Modal.Body>

                <div>
                    <label htmlFor="start-date">Start date: </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate ?? ""}
                        onChange={(e) => setStartDate(e.target.value || null)}
                    />

                    <label className="ms-4" htmlFor="end-date">End date: </label>

                    <input
                        type="date"
                        id="end-date"
                        value={endDate ?? ""}
                        onChange={(e) => setEndDate(e.target.value || null)}
                    />
                </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    {filtered.length > 0 ? (
                                <PDFDownloadLink
                                    document={<PDFFile filtered={filtered} />}
                                    fileName="Liquidation Report"
                                >
                                    {({ loading }) =>
                                        loading ? (
                                            <button
                                                className="btn btn-primary"
                                                disabled
                                            >
                                            Loading Document...
                                            </button>
                                        ) : (
                                            <button
                                            className="btn btn-primary"

                                            >
                                            Download Liquidation Report
                                            </button>
                                        )
                                    }
                                </PDFDownloadLink>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: 10, cursor: "not-allowed" }}
                                    disabled
                                >
                                    Download Liquidation Report
                                </button>
                            )}
                </Modal.Footer>

            </Modal>
        </>
    )
}
