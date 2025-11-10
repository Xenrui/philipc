"use client";

import Banner from "@/app/components/HomeBanner";
import Navigation from "@/app/components/Navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import products from "@/app/data/productMock.json";
import Products from "@/app/components/Products";

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-200 dark:bg-gray-800">
			<Navigation />
			<div className="mx-10">
				<Banner />
				<section id="recommendations" className="max-w-7xl mx-auto">
					<div className="flex justify-between ">
						<div className="text-black dark:text-white">
							<span className="font-semibold text-lg">Recommended for you</span>
						</div>
						<div className="">
							<Link href={"#"} className="flex text-primary hover:text-blue-700 hover:underline">
								View All
								<ChevronRight className="w-6 h-6" />
							</Link>
						</div>
					</div>
					<div className="grid md:grid-cols-2 gap-5 lg:grid-cols-3 grid-flow-row p-5">
						{products.map((product) => {
							return (
								<Products
									key={product.listing_id}
									product={product}
									onClick={() => console.log("view")}
								/>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
