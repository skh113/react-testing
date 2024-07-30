import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
	it("should render the user name when user is provided.", () => {
		const user: User = { id: 1, name: "Keyvan" };

		render(<UserAccount user={user} />);

		expect(screen.getByText(user.name)).toBeInTheDocument();
	});

	it("should render edit button if user has isAdmin prop.", () => {
		const user: User = { id: 1, name: "Keyvan", isAdmin: true };

		render(<UserAccount user={user} />);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent(/edit/i);
	});

	it("should not render edit button if user does not have isAdmin prop.", () => {
		const user: User = { id: 1, name: "Keyvan" };

		render(<UserAccount user={user} />);

		const button = screen.queryByRole("button");
		expect(button).not.toBeInTheDocument();
	});
});
