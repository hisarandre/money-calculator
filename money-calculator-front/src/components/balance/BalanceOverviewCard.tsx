import {useEffect} from "react";
import CardCustom from "@/components/CardCustom.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import {createBalanceOverviewFormSchema} from "@/utils/formSchemas.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {Form} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {addBalance, fetchHistory, fetchMonthlyDone} from "@/store/BalanceSlice.ts";
import {toast} from "@/hooks/use-toast.ts";
import {formatDate} from "@/utils/utils.ts";

const BalanceOverviewCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {accounts, fetchStatus} = useSelector((state: RootState) => state.accounts);
    const {
        monthlyDone,
        monthlyDoneStatus,
        monthlyDoneError,
        addStatus,
        addError
    } = useSelector((state: RootState) => state.balances);
    const currentMonth = formatDate(new Date(), 'long');

    useEffect(() => {
        if (monthlyDoneStatus === "idle") dispatch(fetchMonthlyDone());
    }, [monthlyDoneStatus, dispatch]);

    useEffect(() => {
        if (monthlyDoneStatus === "failed") toast({
            title: "An error occurred",
            description: monthlyDoneError,
            variant: "destructive"
        });
        if (addStatus === "failed") toast({description: addError, variant: "destructive"});
        if (addStatus === "succeeded") toast({description: "Balance added successfully!", variant: "positive"});
    }, [monthlyDoneStatus, monthlyDoneError, addStatus, addError]);

    const formSchema = createBalanceOverviewFormSchema(accounts);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: Object.fromEntries(accounts.map((account) => [String(account.id), 0])),
    });
    const { reset } = form;

    useEffect(() => {
        reset(Object.fromEntries(accounts.map((account) => [String(account.id), 0])));
    }, [accounts, reset]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const mappedData = Object.entries(data).map(([key, value]) => ({
            accountId: Number(key),
            amount: Number(value),
        }));
        const result = await dispatch(addBalance(mappedData));
        if (addBalance.fulfilled.match(result)) {
            await dispatch(fetchHistory());
            await dispatch(fetchMonthlyDone());
        }
    };

    const isLoading = fetchStatus === "loading" || monthlyDoneStatus === "loading";
    const isReady = fetchStatus === "succeeded" && monthlyDoneStatus === "succeeded";

    return (
        <CardCustom title={`Balance Overview: ${currentMonth}`}
                    description="Enter this month's balances for all the accounts">
            {isLoading ? (
                <p>Loading form...</p>
            ) : isReady ? (
                <>
                    {monthlyDone ? (
                        <i>The form has already been submitted this month.</i>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Montant</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accounts.map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-medium">{account.label}</TableCell>
                                                <TableCell>
                                                    <FormFieldCustom form={form} type="number"
                                                                     inputName={String(account.id)}/>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-end">
                                    <Button type="submit">Submit</Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </>
            ) : null}
        </CardCustom>
    );
};

export default BalanceOverviewCard;
