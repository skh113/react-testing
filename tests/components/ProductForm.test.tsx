import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
	let category: Category;
	beforeAll(() => {
		category = db.category.create();
	});
	afterAll(() => {
		db.category.delete({ where: { id: { equals: category.id } } });
	});

	const renderComponent = (product?: Product) => {
		render(<ProductForm onSubmit={vi.fn()} product={product} />, {
			wrapper: AllProviders,
		});

		return {
			// await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
			waitForFormToLoad: async () => {
				await screen.findByRole("form");

				return {
					nameInput: screen.getByPlaceholderText(/name/i),
					priceInput: screen.getByPlaceholderText(/price/i),
					categoryInput: screen.getByRole("combobox", { name: /category/i }),
					submitButton: screen.getByRole("button"),
				};
			},
		};
	};

	it("should render form fields", async () => {
		const { waitForFormToLoad } = renderComponent();
		const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

		expect(nameInput).toBeInTheDocument();
		expect(priceInput).toBeInTheDocument();
		expect(categoryInput).toBeInTheDocument();
	});

	it("should populate form fields when editing a product", async () => {
		const product: Product = {
			id: 1,
			name: "Bread",
			price: 10,
			categoryId: category.id,
		};

		const { waitForFormToLoad } = renderComponent(product);
		const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

		expect(nameInput).toHaveValue(product.name);
		expect(priceInput).toHaveValue(product.price.toString());
		expect(categoryInput).toHaveTextContent(category.name);
	});

	it("should put focus on the name field", async () => {
		const { waitForFormToLoad } = renderComponent();
		const { nameInput } = await waitForFormToLoad();

		expect(nameInput).toHaveFocus();
	});

	it.each([
		{
			scenario: "missing",
			errorMessage: /required/i,
		},
		{
			scenario: "longer than 255 characters",
			name: "a".repeat(256),
			errorMessage: /255/i,
		},
	])(
		"should display an error if name is $scenario",
		async ({ name, errorMessage }) => {
			const { waitForFormToLoad } = renderComponent();

			const form = await waitForFormToLoad();
			const user = userEvent.setup();
			if (name !== undefined) await user.type(form.nameInput, name);
			await user.type(form.priceInput, "10");
			await user.click(form.categoryInput);
			const categories = screen.queryAllByRole("option");
			await user.click(categories[0]);
			await user.click(form.submitButton);

			const error = screen.getByRole("alert");
			expect(error).toBeInTheDocument();
			expect(error).toHaveTextContent(errorMessage);
		},
	);
});
