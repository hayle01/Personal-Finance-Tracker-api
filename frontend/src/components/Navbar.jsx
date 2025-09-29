import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "../lib/Store/authStore";

export const Navbar = () => {
    const navigate = useNavigate();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };
  return (
    <>
     {/* HEADER */}
      <header className="shadow-md bg-white">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          💰 Finance Tracker
        </Link>

        <div className="flex items-center space-x-4">

        {isAuthenticated && (
          <>
               {/* Welcome text (hidden on small screens) */}
        <div className="hidden md:block text-muted-foreground">
          Welcome, <span className="text-gray-600 font-medium">{user?.name ? user.name : "Guest"}</span> 
        </div>

        {/* Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.profile} alt="avatar" />
              <AvatarFallback className='font-medium'>{user?.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          </>
        )}
          {!isAuthenticated && (
            <Link to="/login" className="text-sm font-medium text-primary border bg-secondary px-4 py-2 rounded transition">
              Login
            </Link> 
          ) }
        </div>
        </div>
      </header>
    </>
  )
}
