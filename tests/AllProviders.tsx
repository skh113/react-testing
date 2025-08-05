import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const AllProviders = ({ children }: PropsWithChildren) => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return (
		<QueryClientProvider client={client}>
			<Theme>{children}</Theme>
		</QueryClientProvider>
	);
};

export default AllProviders;
