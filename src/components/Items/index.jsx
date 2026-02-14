import React, { useState, useEffect } from "react";
import "./style.css";

const API = process.env.REACT_APP_API_BASE_URL;

function Items() {
    const [formData, setFormData] = useState({ details: "", amount: "" });
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        fetch(`${API}/getExpenses`, {
            method: "GET",
            credentials: "include",
        })
        .then(res => res.json())
        .then(data => setExpenses(data))
        .catch(err => console.error("Error fetching expenses:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const changeSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/addItems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (response.ok) {
                const newExpense = await response.json();
                setExpenses([...expenses, newExpense]);
                setFormData({ details: "", amount: "" });
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.");
        }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const response = await fetch(`${API}/deleteItem`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
                credentials: "include",
            });
    
            if (response.ok) {
                setExpenses(expenses.filter((expense) => expense._id !== id));
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };
    

    return (
        <div className="items-container">
            <h2 className="items-heading">Add Expense</h2>
            <form className="items-form" onSubmit={changeSubmit}>
                <input type="text" className="items-input" name="details" value={formData.details} onChange={handleChange} placeholder="Expense Details" required />
                <input type="number" className="items-input" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <button type="submit" className="items-button">Add</button>
            </form>

            <h2 className="items-heading">Today's Expenses</h2>
            <ul className="items-list">
                {expenses.length > 0 ? (
                    expenses.map((item) => (
                        <li key={item._id} className="items-list-item">
                            <span className="items-details">{item.details}</span> ₹ {item.amount}
                            <input 
                                type="checkbox" 
                                className="items-checkbox" 
                                onChange={() => handleDeleteExpense(item._id)} 
                            />
                        </li>
                    ))
                ) : (
                    <p>No expenses recorded for today.</p>
                )}
            </ul>
        </div>
    );
}

export default Items;
