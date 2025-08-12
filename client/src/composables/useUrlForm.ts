import { useForm, useField } from "vee-validate";
import * as yup from "yup";

export function useUrlForm(onSubmit: (values: any) => void) {
  const schema = yup.object({
    originalUrl: yup.string().url("Неверный URL").required("Обязательное поле"),
    alias: yup
      .string()
      .matches(/^[A-Za-z0-9\-]+$/, "Только буквы, цифры и дефис")
      .max(20, "До 20 символов")
      .optional(),
    expiresAt: yup
      .date()
      .min(new Date(), "Дата должна быть в будущем")
      .optional(),
  });

  const { handleSubmit, errors } = useForm({ validationSchema: schema });
  const { value: originalUrl } = useField<string>("originalUrl");
  const { value: alias } = useField<string>("alias");
  const { value: expiresAt } = useField<string>("expiresAt");

  const submit = handleSubmit((values) => onSubmit(values));

  return { originalUrl, alias, expiresAt, errors, submit };
}
