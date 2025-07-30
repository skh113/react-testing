import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
	const selectLabels = ["New", "Processed", "Fulfilled"];

	const renderComponent = () => {
		const onChange = vi.fn();
		onChange.mockImplementation((text: string) => console.log(text));

		render(
			<Theme>
				<OrderStatusSelector onChange={onChange} />
			</Theme>
		);

		return {
			trigger: screen.getByRole("combobox"),
			onChange: onChange,
			getOptions: () => screen.findAllByRole("option"),
			getOption: (label: RegExp | string) =>
				screen.findByRole("option", { name: label }),
			user: userEvent.setup(),
		};
	};

	it('should render "New" as the default value', () => {
		const { trigger } = renderComponent();

		expect(trigger).toHaveTextContent(/new/i);
	});

	it("should render correct statuses", async () => {
		const { trigger, getOptions, user } = renderComponent();

		await user.click(trigger);

		const options = await getOptions();
		expect(options).toHaveLength(3);
		const labels = options.map((option) => option.textContent);
		expect(labels).toEqual(selectLabels);
	});

	it.each([
		{ label: selectLabels[1], value: selectLabels[1].toLowerCase() },
		{ label: selectLabels[2], value: selectLabels[2].toLowerCase() },
	])(
		"should call 'onChange' with $value when the $label option is selected",
		async ({ label, value }) => {
			const { trigger, user, onChange, getOption } = renderComponent();
			await user.click(trigger);

			const option = await getOption(label);
			await user.click(option);

			expect(trigger).toHaveTextContent(label);
			expect(onChange).toHaveBeenCalledWith(value);
		}
	);

	it("should call 'onChange' with 'new' when the 'New' option is selected", async () => {
		const { trigger, user, onChange, getOption } = renderComponent();
		const processedLabel = selectLabels[1];
		const newLabel = selectLabels[0];
		const newValue = selectLabels[0].toLowerCase();
		await user.click(trigger);

		const processedOption = await getOption(processedLabel);
		await user.click(processedOption);
		await user.click(trigger);
		const option = await getOption(newLabel);
		await user.click(option);

		expect(trigger).toHaveTextContent(newLabel);
		expect(onChange).toHaveBeenCalledWith(newValue);
	});
});
