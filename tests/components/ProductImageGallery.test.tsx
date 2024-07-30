import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
	it("should not be rendered if list is empty", () => {
		const { container } = render(<ProductImageGallery imageUrls={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render list of images with right src attr", () => {
		const imageUrls: string[] = ["123", "456", "789"];

		render(<ProductImageGallery imageUrls={imageUrls} />);

		const images = screen.getAllByRole("img");
		expect(images).toHaveLength(3);
		imageUrls.forEach((url, index) => {
			expect(images[index]).toHaveAttribute("src", url);
		});
	});
});
