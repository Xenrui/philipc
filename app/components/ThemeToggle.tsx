"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);

	return (
		<button
			onClick={() => setDark(!dark)}
			className="text-sm mx-auto p-2 dark:text-white">
			{dark ? <Sun /> : <Moon />}
		</button>
	);
}
