export async function PUT(req, { params }) {
    const body = await req.json();
    const id = Number(params.id);
    users = users.map(u => (u.id === id ? { ...u, ...body } : u));
    return Response.json({ message: "User updated" });
}

export async function DELETE(req, { params }) {
    const id = Number(params.id);
    users = users.filter(u => u.id !== id);
    return Response.json({ message: "User deleted" });
}
