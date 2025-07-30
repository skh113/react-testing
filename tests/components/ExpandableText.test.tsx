import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
	const limit = 255;
	const longText = "a".repeat(limit + 1);
	const truncatedText = longText.substring(0, limit) + "...";

	it("should render the full text when text is not long", () => {
		const text = "some simple stuff";
		render(<ExpandableText text={text} />);

		const article = screen.getByRole("article");
		expect(article).toHaveTextContent(text);
	});

	it("should truncate text if longer than 255 characters", () => {
		render(<ExpandableText text={longText} />);

		const article = screen.getByRole("article");
		expect(article).toHaveTextContent(truncatedText);

		const button = screen.getByRole("button");
		expect(button).toHaveTextContent(/more/i);
	});

	it("should expand text when show more button is clicked", async () => {
		render(<ExpandableText text={longText} />);

		const article = screen.getByRole("article");
		const button = screen.getByRole("button");
		const user = userEvent.setup();

		await user.click(button);
		expect(button).toHaveTextContent(/less/i);
		expect(article).toHaveTextContent(longText);
	});

	it("should collapse text when show less button is clicked", async () => {
		render(<ExpandableText text={longText} />);
		const article = screen.getByRole("article");
		const showMoreButton = screen.getByRole("button", { name: /more/i });
		const user = userEvent.setup();
		await user.click(showMoreButton);

		const showLessButton = screen.getByRole("button", { name: /less/i });
		await user.click(showLessButton);

		expect(showMoreButton).toHaveTextContent(/more/i);
		expect(article).toHaveTextContent(truncatedText);
	});
});
