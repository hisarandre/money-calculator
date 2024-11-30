import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {UseFormReturn, FieldValues, Path} from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    inputName: keyof T;
    placeHolder?: string;
    type?: string;
    label?: string;
    className?: string;
}

const FormFieldCustom = <T extends FieldValues>({
    form,
    inputName,
    placeHolder,
    type = "text",
    label,
    className,
}: FormFieldProps<T>): React.ReactElement => {
    return (
        <FormField
            control={form.control}
            name={inputName as Path<T>}
            render={({field}) => (
                <FormItem className={className}>
                    <FormLabel className="capitalize">{label ? label : ""}</FormLabel>
                    <FormControl>
                        <Input type={type} placeholder={placeHolder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormFieldCustom;
