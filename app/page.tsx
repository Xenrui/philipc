"use client";

import Banner from "@/app/components/HomeBanner";
import Navigation from "@/app/components/Navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import products from "@/app/data/productMock.json";
import Products from "@/app/components/Products";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-800">
			<Navigation />
			<Banner />
			<section id="recommendations" className="max-w-7xl mx-auto">
				<div className="flex justify-between ">
					<div className="text-black dark:text-white">
						<span className="font-semibold text-lg">Recommended for you</span>
					</div>
					<div className="">
						<Link href={"#"} className="flex text-primary hover:underline">
							View All
							<ChevronRight className="w-6 h-6" />
						</Link>
					</div>
				</div>
				<div className="grid lg:grid-cols-3 grid-flow-row  p-5 	">
					{products.map((product) => {
						return (
							<Products key={product.listing_id} product={product} onClick={() => console.log("view")} />
						);
					})}
				</div>
			</section>
		</div>
	);
}
