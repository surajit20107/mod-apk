"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
	const [formData, setFormData] = useState({
		emailAndUsername: "",
		password: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="h-full flex flex-col items-center justify-center">
			<form className="flex flex-col gap-4 bg-[#030712] px-4 py-6 rounded-lg my-20">
				<h1 className="font-bold text-2xl text-center">Admin Login</h1>

				{/* email */}
				<div className="flex flex-col gap-1">
					<label htmlFor="emailAndUser">
						Email or Username
					</label>
					<input
						id="emailAndUser"
						type="text"
						name="emailAndUser"
						placeholder="Enter email or username"
						className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]"
						value={formData.emailAndUsername}
						onChange={(e) =>
							setFormData({ ...formData, emailAndUsername: e.target.value })
						}
					/>
				</div>

				{/* password */}
				<div className="flex flex-col gap-1">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="Enter password"
						className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]"
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
					/>
				</div>

				{/* submit */}
				<button className="my-3 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-all duration-300"
					onClick={handleSubmit}>
					Login
				</button>
				<p className="text-center">
					Don't have an account?{" "}
					<Link href="/admin/signup" className="text-blue-400 hover:underline">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
