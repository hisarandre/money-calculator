import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {resetBudgetFormSchema} from "@/utils/formSchemas.ts";
import {z} from "zod";
import {resetBudget} from "@/store/BudgetSlice.ts";
import {toast} from "@/hooks/use-toast.ts";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form.tsx";
import {ArrowLeft} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import CardCustom from "@/components/CardCustom.tsx";
import {Link} from "react-router-dom";
import {Switch} from "@/components/ui/switch.tsx";
import {format} from "date-fns";
import {getDayAfter} from "@/utils/utils.ts";

const InitializeBudget = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { resetStatus, resetError } = useSelector((state: RootState) => state.budget);

    const formSchema = resetBudgetFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: getDayAfter(new Date()),
            amount: 0,
            conversion: false,
        },
    });

    const conversion = form.watch("conversion");
    const startDate = form.watch("startDate");

    useEffect(() => {
        if (!conversion) {
            form.setValue("secondaryCurrency", "");
        }
    }, [conversion, form]);

    useEffect(() => {
        if (resetStatus === "failed") {
            toast({
                description: resetError,
                variant: "destructive",
            });
        }

        if (resetStatus === "succeeded") {
            toast({
                title: "Add budget successful!",
                variant: "positive",
            });
            window.location.href = "/daily-budget";
        }
    }, [resetStatus, resetError]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        dispatch(resetBudget(data));
    };

    // TODO: Replace with api call
    // TODO: currencies can't be the same
    const currencies = [
        { code: "EUR", name: "Euro" },
        { code: "KRW", name: "Korean Wons" },
    ];

    return (
        <main className="lg:w-1/2 m-auto flex flex-col gap-4">
            <Button variant="secondary" className="self-start" asChild>
                <Link to="/daily-budget"><ArrowLeft/> Go back to daily budget</Link>
            </Button>

            <CardCustom title="Initialize budget">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="reset-budget-form" className="space-y-8">
                        <FormFieldCustom form={form} inputName="label" label="label" description="This value can be changed later." className="!mt-0"/>
                        <div className="flex gap-3 *:flex-1">
                            <FormFieldCustom form={form} inputName="startDate" label="start date" type="date" className="flex flex-col"/>
                            <FormFieldCustom form={form} inputName="endDate" label="end date" type="date" className="flex flex-col" disabledDates={(date) => date < new Date(startDate)} description="This value can be changed later."/>
                        </div>
                        <FormFieldCustom form={form} inputName="amount" label="amount" type="number" description="This value can be changed later."/>
                        <FormFieldCustom
                            form={form}
                            inputName="mainCurrency"
                            label="currency"
                            type="select"
                            options={currencies}
                            displayKey="name"
                            valueKey="code"
                            placeholder="Select a currency"
                        />
                        <FormField
                            control={form.control}
                            name="conversion"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Currency conversion
                                        </FormLabel>
                                        <FormDescription>
                                            Do you want to convert the amount in another currency?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {conversion && (
                            <FormFieldCustom
                                form={form}
                                inputName="secondaryCurrency"
                                label="secondary currency"
                                type="select"
                                options={currencies}
                                displayKey="name"
                                valueKey="code"
                                placeholder="Select a currency"
                            />
                        )}

                        <div className="flex justify-end">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </CardCustom>
        </main>
    )
}

export default InitializeBudget;