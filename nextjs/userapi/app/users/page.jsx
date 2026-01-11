"use client";
import { useEffect, useState } from "react";

export default function UsersCRUD() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "" });
    const [editId, setEditId] = useState(null);

    // Fetch Users
    const fetchUsers = async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Create or Update User
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await fetch(`/api/users/${editId}`, {
                method: "PUT",
                body: JSON.stringify(form)
            });
            setEditId(null);
        } else {
            await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify(form)
            });
        }
        setForm({ name: "", email: "" });
        fetchUsers();
    };

    // Edit User
    const handleEdit = (user) => {
        setForm({ name: user.name, email: user.email });
        setEditId(user.id);
    };

    // Delete User
    const handleDelete = async (id) => {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-3">User CRUD</h2>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <button className="bg-black text-white px-3 rounded">
                    {editId ? "Update" : "Create"}
                </button>
            </form>

            {/* User List */}
            {users.length === 0 && <p>No users found</p>}

            {users.map(user => (
                <div
                    key={user.id}
                    className="border p-3 rounded mb-2 flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(user)}
                            className="px-2 py-1 border rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(user.id)}
                            className="px-2 py-1 border rounded text-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
