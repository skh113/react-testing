import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import AllProviders from "../AllProviders";
import BrowseProducts from "../../src/pages/BrowseProductsPage";

describe("BrowseProductsPage", () => {
	// Loading
	it("should render loading categories skeletons while fetching data", () => {
		server.use(
			http.get("/categories", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		render(<BrowseProducts />, { wrapper: AllProviders });

		expect(
			screen.getByRole("progressbar", { name: /categories/i })
		).toBeInTheDocument();
	});

	it("should remove the loading indicator after categories data is fetched", async () => {
		render(<BrowseProducts />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /categories/i })
		);
	});

	it("should remove the loading indicator if categories data fetching fails", async () => {
		server.use(http.get("/categories", () => HttpResponse.error()));

		render(<BrowseProducts />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /categories/i })
		);
	});

	it("should render loading products skeletons while fetching data", () => {
		server.use(
			http.get("/products", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		render(<BrowseProducts />, { wrapper: AllProviders });

		expect(
			screen.getByRole("progressbar", { name: /products/i })
		).toBeInTheDocument();
	});

	it("should remove the loading indicator after products data is fetched", async () => {
		render(<BrowseProducts />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /products/i })
		);
	});

	it("should remove the loading indicator if products data fetching fails", async () => {
		server.use(http.get("/products", () => HttpResponse.error()));

		render(<BrowseProducts />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /products/i })
		);
	});

	// Error handling
	it("should not render an error if categories cannot be fetched", async () => {
		server.use(http.get("/categories", () => HttpResponse.error()));

		render(<BrowseProducts />, { wrapper: AllProviders });

		await waitForElementToBeRemoved(() =>
			screen.queryByRole("progressbar", { name: /categories/i })
		);

		expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
		expect(
			screen.queryByRole("combobox", { name: /category/i })
		).not.toBeInTheDocument();
	});

	it("should render an error if products cannot be fetched", async () => {
		server.use(http.get("/products", () => HttpResponse.error()));

		render(<BrowseProducts />, { wrapper: AllProviders });

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	it.todo(
		"should render empty state message if no products were found",
		async () => {}
	);

	it.todo("should render all the categories for filters", () => {});

	it.todo("should render all the products when there is no filter", () => {});

	it.todo("should render products based on the filters", () => {});
});
