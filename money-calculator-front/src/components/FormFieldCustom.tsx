import React from 'react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

interface FormFieldProps {
    form: any;
    inputName: string;
    placeHolder?: string;
    type?: string;
    label?: string;
}

const FormFieldCustom: React.FC<FormFieldProps> = ({form, inputName, placeHolder, type = "text", label}) => {

    return (
        <FormField
            control={form.control}
            name={inputName}
            render={({field}) => (
                <FormItem>
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
