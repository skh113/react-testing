import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
	it("should render nothing when imageUrls is empty", () => {
		const result = render(<ProductImageGallery imageUrls={[]} />);

		expect(result.container).toBeEmptyDOMElement();
	});

	it("should render a list of images with correct attributes", () => {
		const imageUrls = ["123", "456", "789"];
		render(<ProductImageGallery imageUrls={imageUrls} />);

		const images = screen.getAllByRole("img");
		expect(images).toHaveLength(3);
		imageUrls.forEach((url, index) => {
			expect(images[index]).toHaveAttribute("src", url);
		});
	});
});
