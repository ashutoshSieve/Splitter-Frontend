import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import TodayExpense from "../TodaysExpense";

function Community() {
    const { name } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [splitSuccess, setSplitSuccess] = useState("");



    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const response = await fetch(`https://splitter-backend-p26d.onrender.com/community/${name}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();

                if (data.redirect) {
                    window.location.href = data.redirect;
                }

                setCommunity(data);
            } catch (err) {
                console.error("Error fetching community:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunity();
    }, [name]);

    const handleSelectUser = (id) => {
        setSelectedMembers((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((userId) => userId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    

    const handleSplitExpense = async() =>{
        try {
            if(selectedMembers.length===0){
                return alert("Select Atleast one Memeber");
            }
            const response = await fetch(`https://splitter-backend-p26d.onrender.com/commAddExpense/${name}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    communityName: community.name,
                    amount: Number(amount),
                    description,
                    members: selectedMembers.filter(member => member !== null),
                }),
            });

            if (response.ok) {
                setSplitSuccess("Expense split successfully!");
                setAmount("");
                setDescription("");
                setSelectedMembers([]);
                window.location.reload();
            }
        } catch (err) {
            console.error("Error splitting expense:", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="community-container">
                {loading ? (
                    <p className="loading">Loading community details...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="community-content">
                        <h1 className="community-name">{community.name}</h1>

                        <div className="share-link">
                            <p>Share this community link:</p>
                            <input
                                type="text"
                                value={`http://localhost:3000/community/${community.name}`}
                                readOnly
                            />
                            <button onClick={() => navigator.clipboard.writeText(`http://localhost:3000/community/${community.name}`)}>
                                Copy Link
                            </button>
                        </div>

                        <div className="members-list">
                            <h3>Community Members:</h3>
                            {Array.isArray(community?.members) && community.members.length > 0 ? (
                            <ul className="members-list">
                                <li className="list-header">
                                    <span className="header-checkbox">Check</span>
                                    <span className="header-name">Member</span>
                                    <span className="header-borrow">Owes (₹)</span>
                                    <span className="header-give">Receives (₹)</span>
                                </li>
                            
                                {community.members.map((member) => (
                                    <li key={member.userID} className="member-item">
                                        <label className="member-label">
                                            <input
                                                type="checkbox"
                                                className="member-checkbox"
                                                checked={selectedMembers.includes(member.id)} // ✅ Use 'id' instead of 'userID'
                                                onChange={() => handleSelectUser(member.id)}
                                            />
                                            <span className="member-name">{member.name}</span>
                                            <span className="member-balance">{member.take}</span>
                                            <span className="member-balance">{member.give}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>                            
                            
                            
                            ) : (
                                <p>No members are there.</p>
                            )}
                        </div>

                        <div className="date-section">
                            <h3>{community.date}</h3>
                        </div>

                        <a href={`/commTransaction/${community.name}`} className="transaction-link">
                            Transaction History
                        </a>

                        {/* Split Expense Form */}
                        <div className="splitter">
                            <h2>Split an Expense</h2>
                            <input
                                type="number"
                                placeholder="Enter Amount (₹)"
                                value={amount}
                                required
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Enter Description"
                                value={description}
                                required
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <button onClick={handleSplitExpense}>Split Expense</button>
                            {splitSuccess && <p className="success-message">{splitSuccess}</p>}
                        </div>
                        <TodayExpense />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Community;
