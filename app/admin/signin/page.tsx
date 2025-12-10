export default function AdminLogin() {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<form className="flex flex-col gap-4 bg-[#030712] px-4 py-6 rounded-lg my-20">
				<h1 className="font-bold text-2xl text-center">Admin Login</h1>
				
				{/* email */}
				<div className="flex flex-col gap-1">
					<label htmlFor="email">Email</label>
					<input id="email" type="text" placeholder="Enter email" className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]" />
				</div>

				{/* password */}
				<div className="flex flex-col gap-1">
					<label htmlFor="password">Password</label>
					<input id="password" type="password" placeholder="Enter password" className="px-4 py-2 rounded-lg border-2 border-blue-400 outline-none bg-[#1E2939]" />
				</div>

				{/* submit */}
				<button className="my-3 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 transition-all duration-300">Login</button>
			</form>
		</div>
	);
}
