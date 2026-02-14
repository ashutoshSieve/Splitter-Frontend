import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import "./style.css";

const API = process.env.REACT_APP_API_BASE_URL;


function TodayExpense() {
    const { name } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayExpenses = async () => {
            try {
                const response = await fetch(`${API}/todayExpense/${name}`, {
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

        fetchTodayExpenses();
    }, [name]);
    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const response = await fetch(`${API}/commDeleteExpense/${name}`, {
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
        <div className="today-container">
            <div className="today-content">
                <h2 className="title">Today's Expenses</h2>

                {loading ? (
                    <p className="loading">Loading today's expenses...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : expenses.length === 0 ? (
                    <p className="no-data">No expenses recorded for today.</p>
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
                            {expenses.map((expense, index) => (
                                expense.records.map((record, recordIndex) => (
                                    <tr key={`${index}-${recordIndex}`}>
                                        <td>{index + 1}</td>
                                        <td>{record.desc}</td>
                                        <td>{record.amount}</td>
                                        <td>
                                            <button onClick={() => handleDelete(record._id)}>
                                                <FiTrash2 className="text-gray-500 hover:text-red-500 cursor-pointer" />
                                            </button>
                                        </td>
                                        <td>
                                            <a href={`/details/${name}/${expense._id}`}>see in details </a>
                                        </td>
                                    </tr>
                                ))
                            ))}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodayExpense;
