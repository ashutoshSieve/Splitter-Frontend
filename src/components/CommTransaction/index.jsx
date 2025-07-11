import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

function CommunityHistory() {
    const { name } = useParams(); 
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommunityHistory = async () => {
            try {
                const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/commHistory/${name}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Failed to fetch");

                setExpenses(data.expenses);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityHistory();
    }, [name]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        try {
            const response = await fetch(`https://tight-adorne-pulsekein-43f4bedf.koyeb.app/commDelete/${name}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }), 
                credentials: "include",
            });
    
            const data = await response.json();
            if (!response.ok){ 
                throw new Error(data.message || "Failed to delete");
            }else {
                window.location.reload();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="history-container">

                <div className="history-content">
                    <h2 className="title">Community Expense History</h2>

                    {loading ? (
                        <p className="loading">Loading expenses...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : expenses.length === 0 ? (
                        <p className="no-data">No expenses recorded yet.</p>
                    ) : (
                        <div className="table-container">
                            <table className="expense-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Description</th>
                                        <th>Amount (₹)</th>
                                        <th>delete</th>
                                        <th>details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {expenses.reduce((acc, expense) => {
                                    
                                    if (!acc.dates.has(expense.date)) {
                                        acc.dates.add(expense.date);
                                        acc.elements.push(
                                            <tr key={`date-${expense.date}`} className="date-row">
                                                <td colSpan="4"><strong>{expense.date}</strong></td>
                                            </tr>
                                        );
                                    }

                                    
                                    expense.records.forEach((record) => {
                                        acc.globalIndex++; 
                                        acc.elements.push(
                                            <tr key={`${expense.date}-${record.userId}`}>
                                                <td>{acc.globalIndex}</td>  
                                                <td>{record.desc}</td>
                                                <td>{record.amount}</td>
                                                <td>
                                                    <button onClick={() => handleDelete(record._id)}>🗑️</button>
                                                </td>
                                                <td>
                                                    <a href={`/details/${name}/${expense._id}`}>see in details </a>
                                                </td>
                                            </tr>
                                        );
                                    });

                                    return acc;
                                }, { dates: new Set(), elements: [], globalIndex: 0 }).elements}
                            </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CommunityHistory;
