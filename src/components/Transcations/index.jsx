import React, { useState, useEffect } from "react";
import "./style.css";
import NavBar from "../Navbar";
import Footer from "../Footer";

function Transcation() {
    const [expenses, setExpenses] = useState([]);
    const [userName, setUserName] = useState("");

    
    const handleDeleteExpense = async (itemId) => {
        try {
            const response = await fetch("https://splitter-backend-p26d.onrender.com/deleteItem", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: itemId }),
                credentials: "include",
            });
    
            if (response.ok) {
                setExpenses(prevExpenses => 
                    prevExpenses
                        .map(expense => ({
                            ...expense,
                            items: expense.items.filter(item => item._id !== itemId) 
                        }))
                        .filter(expense => expense.items.length > 0) 
                );
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetch("https://splitter-backend-p26d.onrender.com/userHistory", {
            method: "GET",
            credentials: "include",
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch data");
            return res.json();
        })
        .then(data => {
            if (data.name && data.expense) {
                setUserName(data.name);
                setExpenses(data.expense);
            } else {
                console.error("Invalid response format", data);
            }
        })
        .catch(err => console.error("Error fetching expenses:", err));
    }, []);

    return (
        <div>
            <NavBar />
            <div className="transaction-container">
                <h2>{userName ? `${userName}'s Transactions` : "Loading..."}</h2>
                <ul className="transaction-list">
                    {expenses.length > 0 ? (
                        expenses.map((expense, index) => (
                            <li key={index}>
                                <h3>{expense.date}</h3>
                                <ul className="transaction-items">
                                    {expense.items.map((item, idx) => (
                                        <li key={idx}>
                                            <span>{item.details}</span>
                                            <span>₹ {item.amount}</span>
                                            <input 
                                                type="checkbox" 
                                                className="items-checkbox" 
                                                onChange={() => handleDeleteExpense(item._id)} 
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))
                    ) : (
                        <p className="no-transactions">No transaction history found.</p>
                    )}
                </ul>
            </div>
            <Footer />
        </div>
    );
}

export default Transcation;
