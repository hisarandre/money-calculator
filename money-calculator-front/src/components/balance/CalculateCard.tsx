import CardCustom from "@/components/CardCustom.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button.tsx";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {useEffect} from "react";
import {toast} from "@/hooks/use-toast.ts";
import {calculate} from "@/store/BalanceSlice.ts";
import {calculateFormSchema} from "@/utils/formSchemas.ts";

const months = [
    {value: "01", label: "January"},
    {value: "02", label: "February"},
    {value: "03", label: "March"},
    {value: "04", label: "April"},
    {value: "05", label: "May"},
    {value: "06", label: "June"},
    {value: "07", label: "July"},
    {value: "08", label: "August"},
    {value: "09", label: "September"},
    {value: "10", label: "October"},
    {value: "11", label: "November"},
    {value: "12", label: "December"},
];

const currentDate = new Date();
const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
const defaultMonth = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
const defaultYear = String(nextMonthDate.getFullYear());

const CalculateCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {calculResult, calculateStatus, calculateError} = useSelector((state: RootState) => state.balances);

    useEffect(() => {
        if (calculateStatus === "failed") toast({description: calculateError, variant: "destructive"});
    }, [calculateStatus, calculateError]);

    const formSchema = calculateFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            month: defaultMonth,
            year: defaultYear,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formattedDate = `${data.year}-${data.month}-01`;
        await dispatch(calculate(formattedDate));
    };

    return (
        <CardCustom title="Projected Calculation" description="Estimate the future total amount based on current data"
                    className="md:col-start-2 md:row-start-2 lg:col-auto lg:row-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormFieldCustom
                        form={form}
                        inputName="month"
                        label="month"
                        type="select"
                        options={months}
                        displayKey="label"
                        valueKey="value"
                        placeholder="Month"
                    />
                    <div className="w-full flex items-end gap-4">
                        <FormFieldCustom form={form} type="number" inputName="year" label="Year" className="flex-1"/>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>

            {calculateStatus === "succeeded" && (
                <div className="w-full text-2xl font-bold text-center mt-8">
                    {calculResult} €
                </div>
            )}
        </CardCustom>
    )
}

export default CalculateCard;