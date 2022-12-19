import { useMutation } from "react-query";
import { client3 } from "../../lib/client";

function useUpdateTemplateGeneral({ options }) {
	return useMutation(
		(updates) =>
		client3(`general-template/find-match-id`, {
				method: "POST",
				data: updates,
			}), 
			{
				...options
			},
	);
}

export {
	useUpdateTemplateGeneral,
};
