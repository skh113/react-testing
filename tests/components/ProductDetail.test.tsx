import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";

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

		render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

		const name = await screen.findByText(new RegExp(product!.name));
		const price = await screen.findByText(
			new RegExp(product!.price.toString())
		);
		expect(name).toBeInTheDocument();
		expect(price).toBeInTheDocument();
	});

	it("should render error message if productId is not valid", async () => {
		render(<ProductDetail productId={0} />, { wrapper: AllProviders });

		const error = await screen.findByText(/invalid/i);
		expect(error).toBeInTheDocument();
	});

	it("should render empty state message if product was not found", async () => {
		server.use(
			http.get("/products/1", () => {
				return HttpResponse.json(null);
			})
		);

		render(<ProductDetail productId={1} />, { wrapper: AllProviders });

		const message = await screen.findByText(/not found/i);
		expect(message).toBeInTheDocument();
	});

	it("should render error message when there is a general error", async () => {
		server.use(
			http.get("/products/:id", () => {
				return HttpResponse.error();
			})
		);

		render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});

	it("should render a loading indicator when fetching data", async () => {
		server.use(
			http.get("/products/:id", async () => {
				await delay();
				return HttpResponse.json(null);
			})
		);

		render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

		expect(await screen.findByText(/loading/i)).toBeInTheDocument();
	});

	it("should remove the loading indicator after data is fetched", async () => {
		render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	it("should remove the loading indicator if data fetching fails", async () => {
		server.use(http.get("/products/:id", () => HttpResponse.error()));

		render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});
});
