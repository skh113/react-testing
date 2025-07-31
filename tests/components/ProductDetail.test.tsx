import { render, screen } from "@testing-library/react";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
	let productId: number;
	beforeAll(() => {
		const product = db.product.create();
		productId = product.id;
	});
	afterAll(() => {
		db.product.delete({ where: { id: { equals: productId } } });
	});

	it("should render the product details accordingly", async () => {
		const product = db.product.findFirst({
			where: { id: { equals: productId } },
		});

		render(<ProductDetail productId={productId} />);

		const name = await screen.findByText(new RegExp(product!.name));
		const price = await screen.findByText(
			new RegExp(product!.price.toString())
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

	it("should render error message when there is a general error", async () => {
		server.use(
			http.get("/products/:id", () => {
				return HttpResponse.error();
			})
		);

		render(<ProductDetail productId={productId} />);

		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});
});
