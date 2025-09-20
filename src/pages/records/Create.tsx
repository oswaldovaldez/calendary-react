import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import FormRecord, { type RecordFormValues } from "./FormRecord";

const CreateRecord = () => {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	const initialValues: RecordFormValues = {
		patient_id: 0,
		commerce_id: 0,
		record_template_id: null,
		type: null,
		data: {},
		record_templates: [
			{ fields: [] }, 
		],
	};

	const handleSubmit = async (values: RecordFormValues) => {
		await Api.createRecord({
			patient_id: Number(values.patient_id),
			commerce_id: Number(values.commerce_id),
			record_template_id: values.record_template_id
				? Number(values.record_template_id)
				: null,
			type: values.type || null,
			data: values.data,
			_token: token ?? "",
		});
		alert("Record creado con éxito");
		navigate({ to: "/records" });
	};

	return <FormRecord initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateRecord;
