import React from 'react'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Public({ contract }) {

    const [ transactions, setTransactions ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)

    let navigate = useNavigate() 

    const transactionPerPage = 3
    const lastTransactionIndex = currentPage * transactionPerPage
    const firstTransactionIndex = lastTransactionIndex - transactionPerPage
    
    let sortDirection = 1
    let currentPosts = transactions.slice(
        firstTransactionIndex,
        lastTransactionIndex
    )

    useEffect(() => {

        const fetchTransactions = async () => {

            console.log("gettransactions")

            const gettransactions = await contract.methods
                .getAllTransactions()
                .call()
            const reversedList = [...gettransactions].reverse()
            console.log(reversedList)
            setTransactions(reversedList)

            console.log(gettransactions)

        }
    
        if (contract) {
            fetchTransactions()
        }

    }, [contract])

    const handleSortByDate = async () => {
        const gettransactions = await contract.methods.getAllTransactions().call()
        const sortedTransactions = [...gettransactions].sort((a, b) =>
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
                    <h3 class="text-dark">Blockchain Transactions</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 text-nowrap">
                            <button class="btn btn-outline-primary mb-4" role="button" onClick={handleSortByDate}>Sort by date</button> 

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
                                
                                {
                                    transactions.map((transaction) =>{

                                    return (

                                        <tr key={transaction.id} >
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
                                            {/* <td>
                                                <p>{ console.log(JSON.parse(transaction.items))}</p>
                                            </td> */}
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
                                    )}
                                )}

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

        </>
        
    )
}
