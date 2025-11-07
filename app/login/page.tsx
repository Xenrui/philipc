"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isRemembered, setIsRemembered] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Logging in with:", { username, password });
		// connect to backend
	};

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100">
			<div className="hidden lg:flex items-center justify-center bg-[url('/images/form-bg.jpg')] bg-cover bg-center">
				<div className="max-w-lg text-white px-5">
					<h2 className="text-4xl font-extrabold">Frontend na maangas</h2>
					<p className="mt-4 text-lg opacity-90">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem modi repudiandae vel eum magni
						natus.
					</p>
					<div className="mt-8 w-full rounded-md shadow-xl overflow-hidden"></div>
				</div>
			</div>

			<div className="flex relative flex-col items-center gap-10 p-10 pt-20">
				<div className="w-60 h-15 lg:w-85 lg:h-20 relative">
					<Image src="/logo.svg" alt="PhiliPC Logo" fill priority className="object-contain" />
				</div>
				<div className="flex flex-col m-auto bottom-10 w-full max-w-md rounded-lg bg-white p-8 shadow-md relative z-10">
					<h2 className="mb-6 text-center text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
						{" "}
						Welcome Back!
					</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Input */}
						<div className="relative">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder=" "
								className="peer block w-full rounded-md border text-black border-gray-300 px-3 pt-5 pb-2 shadow-sm placeholder-transparent focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
							/>
							<label
								htmlFor="email"
								className="absolute hover:cursor-text left-3 top-2 text-gray-500 text-sm transition-all duration-150 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary">
								Email address
							</label>
						</div>

						{/* Password Input */}
						<div className="relative">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder=" "
								className="peer block w-full rounded-md border text-black border-gray-300 px-3 pt-5 pb-2 shadow-sm placeholder-transparent focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
							/>
							<label
								htmlFor="password"
								className="absolute hover:cursor-text left-3 top-2 text-gray-500 text-sm transition-all duration-150 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary">
								Password
							</label>
						</div>

						{/* Remember me Checkbox */}
						<div className="flex gap-3">
							<input
								type="checkbox"
								name="remember"
								id="remember"
								checked={isRemembered}
								onChange={() => setIsRemembered(!isRemembered)}
								className="w-4 peer"
							/>
							<label
								htmlFor="remember"
								className={`lg:text-sm ${isRemembered ? "text-primary" : "text-gray-700"}`}>
								Remember Me
							</label>
						</div>
						{/* Submit Button */}
						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
								Log in
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
