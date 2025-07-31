import { http, HttpResponse } from "msw";
import { products } from "./data";

export const handlers = [
	http.get("/products", () => {
		return HttpResponse.json(products);
	}),

	http.get<{ id: string }>("/products/:id", ({ params }) => {
		const { id } = params;
		const product = products.find((p) => p.id === parseInt(id));
		if (!product) return new HttpResponse(null, { status: 404 });
		return HttpResponse.json(product);
	}),
];
