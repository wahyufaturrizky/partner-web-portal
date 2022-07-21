import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchSequenceFormat = async () => {
	return client(`/master/sequence-number`).then((data) => data);
};

const useSequenceFormat = ({ options = {} }) => {
	return useQuery("sequence-format", fetchSequenceFormat, {
		...options,
	});
};

function useCreateSequenceFormat({ options }) {
	return useMutation(
		(updates) =>
			client(`/master/sequence-number/preview`, {
				method: "POST",
				data: updates,
			}),
		{ ...options }
	);
}

function useUpdateSequenceFormat({ options }) {
	return useMutation(
		(updates) =>
			client(`/master/sequence-number`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

export { useSequenceFormat, useCreateSequenceFormat, useUpdateSequenceFormat };
