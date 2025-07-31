import { render, screen } from "@testing-library/react";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";

describe("ProductList", () => {
	it("should render the product details accordingly", async () => {
		render(<ProductDetail productId={1} />);

		const name = await screen.findByText(new RegExp(products[0].name));
		const price = await screen.findByText(
			new RegExp(products[0].price.toString())
		);
		expect(name).toBeInTheDocument();
		expect(price).toBeInTheDocument();
	});

	it("should render error message if productId is not valid", async () => {
		render(<ProductDetail productId={0} />);

		const error = await screen.findByText(/invalid/i);
		expect(error).toBeInTheDocument();
	});

	it("should render empty state message if product was not found", async () => {
		server.use(
			http.get("/products/1", () => {
				return HttpResponse.json(null);
			})
		);

		render(<ProductDetail productId={1} />);

		const message = await screen.findByText(/not found/i);
		expect(message).toBeInTheDocument();
	});
});
