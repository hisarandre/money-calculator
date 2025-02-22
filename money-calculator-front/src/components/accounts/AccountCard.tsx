import {useEffect, useState} from "react";
import CardCustom from "@/components/CardCustom";
import TableCustom from "../TableCustom";
import AddAccount from "./modals/AddAccount";
import {toast} from "@/hooks/use-toast";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {fetchAccounts} from "@/store/AccountSlice.ts";
import DeleteAccount from "./modals/DeleteAccount";
import {Account} from "@/models/Account";
import EditAccount from "./modals/EditAccount";

const AccountCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {accounts, fetchStatus, fetchError} = useSelector((state: RootState) => state.accounts);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [accountId, setAccountId] = useState<number>(0);
    const [account, setAccount] = useState<Account>({id: 0, label: "", fee: 0});

    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchAccounts());
        }
    }, [fetchStatus, dispatch]);

    useEffect(() => {
        if (fetchStatus === "failed") {
            toast({title: "An error occurred", description: fetchError, variant: "destructive"});
        }
    }, [fetchStatus, fetchError]);

    const columns = ["label", "fee"];
    const mappedData = accounts.map((d) => ({
        id: d.id,
        label: d.label,
        fee: d.fee,
    }));

    const onDelete = (id: number) => {
        setAccountId(id);
        setIsDeleteDialogOpen(true);
    };

    const onEdit = (account: Account) => {
        setAccount(account);
        setIsEditDialogOpen(true);
    };

    return (
        <CardCustom title="Accounts" description="All available accounts" addAction={() => setIsAddDialogOpen(true)}>
            {fetchStatus === "succeeded" && (
                <>
                    <TableCustom<Account>
                        columns={columns}
                        data={mappedData}
                        canDelete={true}
                        canEdit={true}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />

                    <AddAccount isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}/>
                    <EditAccount account={account} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}/>
                    <DeleteAccount accountId={accountId} isOpen={isDeleteDialogOpen}
                                   onOpenChange={setIsDeleteDialogOpen}/>
                </>
            )}
            {fetchStatus === "loading" && <p>Loading accounts...</p>}
        </CardCustom>
    );
};

export default AccountCard;
