import User from "../models/User.js";

//get all users

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}


//create user
export const createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
}

//update user
export const updateUser = async (req, res) => {
    const updated = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
};

//delete user
export const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({
        message: "user deleted successfully"
    })
};