import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronUp, Settings, LogOut } from "lucide-react";
import {toast} from "@/hooks/use-toast";
import {useAuth} from '@/services/AuthContext';
import {signOut} from 'firebase/auth';
import {auth} from '@/config/firebase-config';
import {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "@/store/Store.ts";
import {useFetchData} from "@/hooks/use-fetch-data.ts";
import {fetchUser, setCurrentUid} from "@/store/UserSlice";
import {useNavigate} from "react-router-dom";

function UserSideBar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        currentUser,
        fetchStatus,
        fetchError,
    } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (user?.uid) {
            dispatch(setCurrentUid(user.uid));
        }
    }, [user?.uid, dispatch]);

    useFetchData({
        fetchStatus,
        fetchError,
        fetchAction: fetchUser,
    });

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Goodbye",
                description: "You have successfully logged out.",
                variant: "positive",
            });
            navigate('/login');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            toast({
                title: "Log Out Failed",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

  return (
    <>
       <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 w-full px-2 py-1.5 rounded-md hover:bg-muted">
            {/* User Avatar */}
            <Avatar className="w-10 h-10 rounded-md overflow-hidden">
            <AvatarImage
                className="object-cover w-full h-full"
                src={currentUser?.photoURL || "/default-avatar.png"}
                alt={currentUser?.displayName || "User"}
            />
            <AvatarFallback>{currentUser?.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {/* User Info */}
            <div className="flex flex-col text-left overflow-hidden">
                <span className="block text-sm font-medium text-foreground truncate">
                    {currentUser?.displayName || "User"}
                </span>
                <span className="block text-xs text-muted-foreground truncate">
                    {currentUser?.email || "mail@example.com"}
                </span>
            </div>

            {/* Dropdown Icon */}
            <ChevronUp className="ml-auto h-4" />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="center" side="top" className="w-52">
            {/* Settings Option */}
            <DropdownMenuItem onClick={() => navigate('/settings')}> 
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                Settings
            </DropdownMenuItem>
            
            {/* Log Out Option */}
            <DropdownMenuItem
                onClick={handleLogOut}
                className="group flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 focus:bg-red-500 focus:text-white"
            >
                <LogOut className="mr-2 h-4 w-4 text-red-500 group-hover:text-white" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserSideBar;
