import React from 'react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {UseFormReturn} from "react-hook-form";

interface FormFieldProps<T> {
    form: UseFormReturn<T>;
    inputName: keyof T;
    placeHolder?: string;
    type?: string;
    label?: string;
    className?: string;
}

const FormFieldCustom = <T,>({
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
            name={inputName}
            render={({field}) => (
                <FormItem className={className}>
                    <FormLabel className="capitalize">{label ? label : ""}</FormLabel>
                    <FormControl>
                        <Input type={type} placeholder={placeHolder} {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export default FormFieldCustom;
