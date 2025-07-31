import { http, HttpResponse } from "msw";
import { Product } from "../../src/entities";

export const handlers = [
	http.get("/categories", () => {
		return HttpResponse.json([
			{ id: 1, name: "Electronics" },
			{ id: 2, name: "Beauty" },
			{ id: 3, name: "Gardening" },
		]);
	}),
	http.get("/products", () => {
		return HttpResponse.json([
			{ id: 1, name: "abc" },
			{ id: 2, name: "123" },
			{ id: 3, name: "asd" },
		]);
	}),
	http.get<{ id: string }>("/products/:id", ({ params }) => {
		const { id } = params;

		return HttpResponse.json({
			id: parseInt(id),
			name: `Product ${id}`,
			price: 123,
			categoryId: 1,
		} as Product);
	}),
];
