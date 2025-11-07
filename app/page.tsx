import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-700 font-sans">
			<main className="flex flex-col min-h-screen w-full max-w-3xl items-center justify-between py-10 px-16 sm:items-center">
				<h1 className="text-center m-auto text-4xl text-zinc-50 font-bold">PhiliPC</h1>
				<div className="flex gap-10">
					<Link href="/login" className="hover:underline">Log in</Link>
					<Link href="/signup" className="hover:underline"> Sign up</Link>
				</div>
			</main>
		</div>
	);
}
