import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductList", () => {
	const productIds: number[] = [1, 2, 3];
	beforeAll(() => {
		productIds.forEach(() => {
			const product = db.product.create();
			productIds.push(product.id);
		});
	});
	afterAll(() => {
		db.product.deleteMany({ where: { id: { in: productIds } } });
	});

	it("should render the list of products", async () => {
		render(<ProductList />);

		const items = await screen.findAllByRole("listitem");
		expect(items.length).toBeGreaterThan(0);
	});

	it("should render the empty state message if no products is found", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.json([]);
			})
		);

		render(<ProductList />);

		const emptyStateMessage = await screen.findByText(/no products/i);
		expect(emptyStateMessage).toBeInTheDocument();
	});
});
