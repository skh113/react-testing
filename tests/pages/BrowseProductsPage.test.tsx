import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { Category } from "../../src/entities";
import { db } from "../mocks/db";

describe("BrowseProductsPage", () => {
	const categories: Category[] = [];

	beforeAll(() => {
		[1, 2].forEach(() => {
			categories.push(db.category.create());
		});
	});

	afterAll(() => {
		const categoryIds = categories.map((category) => category.id);
		db.category.deleteMany({ where: { id: { in: categoryIds } } });
	});

	const renderComponent = () => {
		render(
			<Theme>
				<BrowseProducts />
			</Theme>
		);
	};

	// Loading Categories
	it("should show a loading skeleton when fetching categories", () => {
		server.use(
			http.get("/categories", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		renderComponent();

		expect(
			screen.getByRole("progressbar", { name: /categories/i })
		).toBeInTheDocument();
	});

	it("should remove the loading indicator after categories data is fetched", async () => {
		renderComponent();

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /categories/i })
		);
	});

	it("should remove the loading indicator if categories data fetching fails", async () => {
		server.use(http.get("/categories", () => HttpResponse.error()));

		renderComponent();

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /categories/i })
		);
	});

	// Loading Products
	it("should show a loading skeleton when fetching products", () => {
		server.use(
			http.get("/products", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);
		renderComponent();

		expect(
			screen.getByRole("progressbar", { name: /products/i })
		).toBeInTheDocument();
	});

	it("should remove the loading indicator after products data is fetched", async () => {
		renderComponent();

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /products/i })
		);
	});

	it("should remove the loading indicator if products data fetching fails", async () => {
		server.use(http.get("/products", () => HttpResponse.error()));

		renderComponent();

		await waitForElementToBeRemoved(() =>
			screen.getByRole("progressbar", { name: /products/i })
		);
	});

	// Error handling
	it("should not render an error if categories cannot be fetched", async () => {
		server.use(http.get("/categories", () => HttpResponse.error()));

		renderComponent();

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

		renderComponent();

		expect(await screen.findByText(/error/i)).toBeInTheDocument();
	});

	// Rendering
	it("should render the categories for filters", async () => {
		// 18
		renderComponent();

		const combobox = await screen.findByRole("combobox");
		expect(combobox).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(combobox);

		const options = await screen.findAllByRole("option");
		expect(options.length).toBeGreaterThan(0);
	});

	it.todo(
		"should render empty state message if no products were found",
		async () => {}
	);

	it.todo("should render all the categories for filters", () => {});

	it.todo("should render all the products when there is no filter", () => {});

	it.todo("should render products based on the filters", () => {});
});
