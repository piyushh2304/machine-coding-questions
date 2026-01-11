let users = [
    {
        id: 1,
        name: "piyush",
        email: "piyush@gmail.com"
    },
    {
        id: 2,
        name: "pratham tomar",
        email: "pratham@gmail.com"
    },
    {
        id: 3,
        name: "manali",
        email: "manali@gmail.com"
    }
]



export async function GET() {
    return Response.json(users)
}

export async function POST(req) {
    const body = await req.json();
    const newUser = {
        id: users.length + 1,
        name: body.name,
        email: body.email
    }
    users.push(newUser)
    return Response.json(newUser)
}