import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
	const adminUser: User = { id: 1, name: "Mosh", isAdmin: true };
	const user: User = { id: 1, name: "Keyvan" };

	it("should display username correctly.", () => {
		render(<UserAccount user={user} />);

		const name = screen.getByText(/keyvan/i);
		expect(name).toBeInTheDocument();
	});

	it("should display edit button if the user is an admin.", () => {
		render(<UserAccount user={adminUser} />);

		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent(/edit/i);
	});

	it("should not display edit button if user is not an admin.", () => {
		render(<UserAccount user={user} />);

		const button = screen.queryByRole("button");
		expect(button).not.toBeInTheDocument();
	});
});
