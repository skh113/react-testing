import ExpandableText from "../components/ExpandableText";
import Onboarding from "../components/Onboarding";
import SearchBox from "../components/SearchBox";
import TermsAndConditions from "../components/TermsAndConditions";

const PlaygroundPage = () => {
	return (
		<section className="gap-6 flex flex-col">
			<Onboarding />
			<SearchBox onChange={(text) => console.log(text)} />
			<TermsAndConditions />
			<ExpandableText text="Lorem!" />
			<ExpandableText text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos et incidunt vero velit reiciendis cum ea cupiditate labore maxime tenetur reprehenderit, eligendi architecto consequatur est dolor aliquam recusandae, esse repudiandae optio. Hic et, ut nisi nihil sed ullam natus necessitatibus explicabo magnam! Delectus dolorum commodi suscipit aliquam omnis officia consequuntur quisquam. Necessitatibus nesciunt qui quam eveniet hic minima id illum corporis quis repudiandae repellat soluta ex eligendi tenetur, maiores ipsam aperiam aut vitae, ea autem. Ratione exercitationem sapiente distinctio nesciunt, obcaecati sint modi, similique labore ducimus, ipsa adipisci nobis unde. Quia soluta accusamus, dolores quis architecto voluptas vel modi harum!" />
		</section>
	);
};

export default PlaygroundPage;
