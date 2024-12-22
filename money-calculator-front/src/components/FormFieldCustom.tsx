import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {UseFormReturn, FieldValues, Path} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/utils/cn.ts";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface FormFieldProps<T extends FieldValues, O = Record<string, unknown>> {
    form: UseFormReturn<T>;
    inputName: keyof T;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    disabledDates?: (date: Date) => boolean;
    options?: Array<O>;
    displayKey?: keyof O;
    valueKey?: keyof O;
    label?: string;
    description?: string;
    className?: string;
}

const FormFieldCustom = <T extends FieldValues, O = Record<string, unknown>>({
    form,
    inputName,
    placeholder,
    type = "text",
    disabled = false,
    disabledDates = () => false,
    options,
    displayKey,
    valueKey,
    label,
    description,
    className,
}: FormFieldProps<T, O>): React.ReactElement => {
    return (
        <FormField
            control={form.control}
            name={inputName as Path<T>}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className="capitalize">
                        {label || ""}
                    </FormLabel>
                    {type === "date" ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(new Date(field.value), "dd/MM/yyyy")
                                        ) : (
                                            <span>{placeholder || "Pick a date"}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={
                                        field.value
                                            ? new Date(field.value)
                                            : undefined
                                    }
                                    defaultMonth={new Date(field.value)}
                                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                    disabled={disabledDates}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    ) : type === "select" && options ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options.map((option, index) => (
                                    <SelectItem
                                        key={index}
                                        value={
                                            option[valueKey as keyof O] as string
                                        }
                                    >
                                        {option[displayKey as keyof O] as string}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <FormControl>
                            <Input
                                disabled={disabled}
                                type={type}
                                placeholder={placeholder}
                                {...field}
                            />
                        </FormControl>
                    )}
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormFieldCustom;
