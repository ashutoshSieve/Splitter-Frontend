import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./style.css";

function ExpenseDetails() {
    const { name, ID } = useParams();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenseDetails = async () => {
            try {
                const response = await fetch(`https://splitter-backend-p26d.onrender.com/readInDetails/${name}/${ID}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch");
                
                // Ensure we store the correct data
                setExpense(data); // No need to access `data.expense`
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseDetails();
    }, [name, ID]);

    return (
        <div>
            <Navbar />
            <div className="details-container">
                <h2 className="title">Expense Details</h2>

                {loading ? (
                    <p className="loading">Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : expense ? (
                    <div className="expense-details">
                        <p><strong>Date:</strong> {expense?.date || "N/A"}</p>

                        {expense?.records?.length > 0 ? (
                            expense.records.map((record, index) => (
                                <div key={index} className="record">
                                    <p><strong>Description:</strong> {record?.desc || "No description"}</p>
                                    <p><strong>Amount:</strong> ₹{record?.amount || 0}</p>
                                    <p><strong>Added By:</strong> {record?.addedBy || "Unknown"}</p>
                                    <p><strong>Members Involved:</strong> {record?.users?.length > 0 ? record.users.join(", ") : "None"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No records found for this expense.</p>
                        )}
                    </div>
                ) : (
                    <p>No expense details available.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ExpenseDetails;
