import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getUsers } from "./action";

export default async function Users() {
    if (!(await isAdmin())) {
        redirect("/login");
    }

    const data = await getUsers();

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Users</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {data.length} registered user{data.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm divide-y divide-neutral-100 overflow-hidden">
                {data.length === 0 ? (
                    <p className="p-6 text-sm text-neutral-500">No users found.</p>
                ) : (
                    data.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors"
                        >
                            <span className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-neutral-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                            </div>
                            <span
                                className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    user.role === "admin"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-neutral-100 text-neutral-500"
                                }`}
                            >
                                {user.role === "admin" ? "Admin" : "User"}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}