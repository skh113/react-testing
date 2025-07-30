import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
	const searchTerm = "Keyvan";

	const renderComponent = () => {
		const onChange = vi.fn();
		onChange.mockImplementation((text: string) => console.log(text));

		const user = userEvent.setup();

		render(<SearchBox onChange={onChange} />);

		return {
			input: screen.getByPlaceholderText(/search/i),
			onChange: onChange,
			user: user,
		};
	};

	it("should call the 'onChange' function if search term is not empty and user hits 'enter'", async () => {
		const { input, onChange, user } = renderComponent();

		await user.type(input, searchTerm + "{enter}");

		expect(input).toHaveValue(searchTerm);
		expect(onChange).toHaveBeenCalledWith(searchTerm);
	});

	it("should not call the 'onChange' function if search term is empty and user hits 'enter'", async () => {
		const { input, onChange, user } = renderComponent();

		await user.type(input, "{enter}");

		expect(input).not.toHaveValue();
		expect(onChange).not.toHaveBeenCalled();
	});
});
