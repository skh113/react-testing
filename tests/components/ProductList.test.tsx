import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { QueryClient, QueryClientProvider } from "react-query";

describe("ProductList", () => {
	const productIds: number[] = [];

	beforeAll(() => {
		[1, 2, 3].forEach(() => {
			const product = db.product.create();
			productIds.push(product.id);
		});
	});
	afterAll(() => {
		db.product.deleteMany({ where: { id: { in: productIds } } });
	});

	const renderComponent = () => {
		const client = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		render(
			<QueryClientProvider client={client}>
				<ProductList />
			</QueryClientProvider>
		);
	};

	it("should render the list of products", async () => {
		renderComponent();

		const items = await screen.findAllByRole("listitem");
		expect(items.length).toBeGreaterThan(0);
	});

	it("should render the empty state message if no products is found", async () => {
		server.use(http.get("/products", () => HttpResponse.json([])));

		renderComponent();

		const emptyStateMessage = await screen.findByText(/no products/i);
		expect(emptyStateMessage).toBeInTheDocument();
	});

	it("should render an error message when there is an error", async () => {
		server.use(http.get("/products", () => HttpResponse.error()));

		renderComponent();

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	it("should render a loading indicator when fetching data", async () => {
		server.use(
			http.get("/products", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);

		renderComponent();

		expect(await screen.findByText(/loading/i)).toBeInTheDocument();
	});

	it("should remove the loading indicator after data is fetched", async () => {
		renderComponent();

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	it("should remove the loading indicator if data fetching fails", async () => {
		server.use(http.get("/products", () => HttpResponse.error()));

		renderComponent();

		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});
});
