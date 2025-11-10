import { MoveRight, ShieldCheck } from "lucide-react";
import React from "react";

const Banner = () => {
	return (
		<div className="flex w-full max-w-7xl mx-auto justify-center py-10 grid-rows-1 grid-cols-2 h-fit">
			{/* Left */}
			<div className="flex flex-col justify-between min-h-80 gap-5 bg-blue-100 w-md rounded-3xl md:rounded-r-none p-7">
				<div className="text-black">
					<h1 className="font-extrabold text-2xl lg:text-4xl mb-4">Tech Enthusiasts, Welcome Home</h1>
					<span className="text-neutral text-sm md:text-md ">
						Performance-grade GPUs, high refresh monitors, and custom-key peripherals: the hardware to
						perfect your setup
					</span>
				</div>
				<div className="">
					<button className="flex bg-light-primary hover:bg-dark-primary border-[#33444A] hover:border-dark-primary text-[#33444A] hover:text-light-primary lg:w-50 py-2 px-5 rounded-4xl border-4 hover:cursor-pointer">
						<span className="m-auto font-extrabold text-xl">Buy now</span>
						<MoveRight className="inline w-10 h-10 m-auto " />
					</button>
				</div>
			</div>

			{/* Right */}
			<div className="hidden md:inline relative z-0 bg-[#7AA2B8] w-4xl rounded-r-3xl ">
				<div className="absolute bg-[#A3D4D3] w-fit h-30 -inset-x-2 inset-y-15 flex p-3 border-b-4 border-gray-500">
					<ShieldCheck className="w-15 h-15 lg:w-17 lg:h-17 m-auto text-gray-600" />
					<span className="m-auto mask-linear-from-neutral-800 font-extrabold text-3xl lg:text-4xl text-gray-600">
						Shop with Confidence
					</span>
				</div>
			</div>
		</div>
	);
};

export default Banner;
