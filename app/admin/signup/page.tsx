"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminRegister() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<form className="flex flex-col gap-4 bg-[#030712] px-4 py-6 rounded-lg my-12">
				<h1 className="font-bold text-2xl text-center">Admin Register</h1>

				{/* username */}
				<div className="flex flex-col gap-1">
					<label htmlFor="userName">Username</label>
					<input
						id="userName"
						type="text"
						placeholder="Enter username"
						className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]"
						value={formData.username}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
					/>
				</div>

				{/* email */}
				<div className="flex flex-col gap-1">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="text"
						placeholder="Enter email"
						className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]"
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
				</div>

				{/* password */}
				<div className="flex flex-col gap-1">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						placeholder="Enter password"
						className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]"
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
					/>
				</div>

				{/* submit */}
				<button
					className="my-3 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-all duration-300"
					onClick={handleSubmit}
				>
					Login
				</button>
				<p className="text-center">
					Already have an account?{" "}
					<Link href="/admin/signin" className="text-blue-400 hover:underline">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}
