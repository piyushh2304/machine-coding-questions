import type { User } from "../types/User";

interface Props {
    user: User;
}

const UserCard = ({ user }: Props) => {
    return (
        <div className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-zinc-700">
            <h2 className="mb-4 text-2xl font-bold text-white border-b border-zinc-800 pb-2">
                {user.name}
            </h2>

            <div className="space-y-2 text-sm text-gray-300">
                <p>
                    <span className="font-semibold text-zinc-400">Username:</span> {user.username}
                </p>

                <p>
                    <span className="font-semibold text-zinc-400">Email:</span> {user.email}
                </p>

                <p>
                    <span className="font-semibold text-zinc-400">Phone:</span> {user.phone}
                </p>

                <p>
                    <span className="font-semibold text-zinc-400">Website:</span> {user.website}
                </p>

                <p>
                    <span className="font-semibold text-zinc-400">Company:</span> {typeof user.company === 'object' ? user.company?.name : user.company}
                </p>

                <p>
                    <span className="font-semibold text-zinc-400">City:</span> {typeof user.address === 'object' ? user.address?.city : user.address}
                </p>
            </div>
        </div>
    );
};

export default UserCard;