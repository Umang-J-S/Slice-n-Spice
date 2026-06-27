import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import CategoryForm from "../../components/admin/CategoryForm";
import ItemForm from "../../components/admin/ItemForm";
import ChefForm from "../../components/admin/ChefForm";
import SpecialForm from "../../components/admin/SpecialForm";
import AdminSearch from "../../components/admin/AdminSearch";
import logo from "../../assets/logo.png";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const maskEmail = (email?: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col overflow-hidden">
      {/* Solid Black Theme Background */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        {/* Very subtle ambient light at the top for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.03),transparent_70%)]"></div>
      </div>

      <header className="relative z-50 border-b border-white/10 p-4 flex flex-wrap items-center justify-between bg-black/40 backdrop-blur-md">
        {/* Left Side: Logo */}
        <div 
          className="flex items-center gap-3 w-[45%] sm:w-auto lg:w-[30%] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Slice 'n Spice Logo" className="w-10 sm:w-12 h-auto" />
          <h1 className="text-xl font-bold text-white hidden md:block">Slice 'n Spice Admin</h1>
        </div>

        {/* Center: Search Bar */}
        <div className="w-full order-last mt-4 sm:mt-0 sm:order-none sm:flex-1 max-w-2xl sm:px-4 flex justify-center z-[60]">
          <AdminSearch />
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 w-[50%] sm:w-auto lg:w-[30%]">
          <span className="text-sm text-white/60 hidden lg:inline">
            <strong className="text-white">{user?.displayName || maskEmail(user?.email)}</strong>
          </span>
          {user?.photo && (
            <img src={user.photo} alt="Avatar" className="w-8 h-8 rounded-full border border-amber-400/50" />
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/")} 
            className="gap-1 border-white/20 bg-white/5 hover:bg-amber-400 hover:text-black hover:border-amber-400 text-white transition-colors px-3"
          >
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Main Menu</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsLogoutModalOpen(true)} 
            className="border-white/20 bg-white/5 hover:bg-amber-400 hover:text-black hover:border-amber-400 text-white transition-colors px-3"
          >
            Logout
          </Button>
        </div>
      </header>
      
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area - Forms */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Dashboard
              </h2>
              <p className="text-white/60 mt-1">
                Welcome back, Admin. Here you can manage your menu, chefs, and specials.
              </p>
            </div>
            
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl h-auto gap-2 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-full shadow-2xl">
                <TabsTrigger value="categories" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.5)] rounded-xl sm:rounded-full transition-all hover:bg-white/10 text-white/70 hover:text-white data-[state=active]:font-extrabold font-semibold py-2.5">Categories</TabsTrigger>
                <TabsTrigger value="items" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.5)] rounded-xl sm:rounded-full transition-all hover:bg-white/10 text-white/70 hover:text-white data-[state=active]:font-extrabold font-semibold py-2.5">Menu Items</TabsTrigger>
                <TabsTrigger value="chefs" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.5)] rounded-xl sm:rounded-full transition-all hover:bg-white/10 text-white/70 hover:text-white data-[state=active]:font-extrabold font-semibold py-2.5">Chefs</TabsTrigger>
                <TabsTrigger value="specials" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.5)] rounded-xl sm:rounded-full transition-all hover:bg-white/10 text-white/70 hover:text-white data-[state=active]:font-extrabold font-semibold py-2.5">Specials</TabsTrigger>
              </TabsList>
              <div className="mt-8 p-6 sm:p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl text-white shadow-2xl overflow-hidden max-w-3xl relative">
                
                <div className="relative z-10">
                  <TabsContent value="categories">
                    <h3 className="text-xl font-bold mb-6 text-amber-400">Add New Category</h3>
                    <CategoryForm />
                  </TabsContent>
                  <TabsContent value="items">
                    <h3 className="text-xl font-bold mb-6 text-amber-400">Add New Menu Item</h3>
                    <ItemForm />
                  </TabsContent>
                  <TabsContent value="chefs">
                    <h3 className="text-xl font-bold mb-6 text-amber-400">Add New Chef</h3>
                    <ChefForm />
                  </TabsContent>
                  <TabsContent value="specials">
                    <h3 className="text-xl font-bold mb-6 text-amber-400">Set Today's Special</h3>
                    <SpecialForm />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
      
      <ConfirmDialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
      />
    </div>
  );
}
