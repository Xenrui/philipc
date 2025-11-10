import React from "react";

import { User } from "lucide-react";
import Image from "next/image";
import Button from "@/app/components/Button";
import { Product } from "@/app/data/types";

interface ProductProps {
	product: Product;
	onClick: (product: Product) => void;
}

const Products: React.FC<ProductProps> = ({ product, onClick }) => {
	return (
		<div className="flex flex-col min-h-50 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
			{/* User */}
			<div className="flex items-center gap-2 mb-3">
				<div className="rounded-4xl p-2 bg-blue-50">
					<User className="text-black w-8 h-8" />
				</div>
				<span className="text-black dark:text-white">
					{product.fname} {product.lname}
				</span>
			</div>

			{/* Image */}
			<div className="relative w-full h-50">
				<Image
					src={"https://down-ph.img.susercontent.com/file/ph-11134207-7r98v-lvk7ew0vuxfp28_tn.webp"}
					alt="Test Image"
					fill
				/>
			</div>

			{/* Product Details */}
			<div className="grow flex flex-col gap-1 text-black dark:text-white my-3">
				<span className="font-semibold text-lg">{product.item_name}</span>
				<span>${product.item_price}</span>
			</div>

			{/* Button */}
			<div className="flex justify-center">
				<Button label="View Product" />
			</div>
		</div>
	);
};

export default Products;
