import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../context/AuthContext";
import CategoryForm from "../../components/admin/CategoryForm";
import ItemForm from "../../components/admin/ItemForm";
import ChefForm from "../../components/admin/ChefForm";
import SpecialForm from "../../components/admin/SpecialForm";
import AdminSearch from "../../components/admin/AdminSearch";
import logo from "../../assets/logo.png";
import { Search, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Slice 'n Spice Logo" className="w-12 h-auto" />
          <h1 className="text-xl font-bold">Slice 'n Spice Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline">
            Logged in as <strong className="text-foreground">{user?.displayName || user?.email}</strong>
          </span>
          {user?.photo && (
            <img src={user.photo} alt="Avatar" className="w-8 h-8 rounded-full" />
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 border border-border">
            <Home className="h-4 w-4" />
            Main Menu
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar - Global Search */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border p-6 bg-card/50 flex flex-col overflow-y-auto max-h-[400px] lg:max-h-none">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Global Database Search
          </h3>
          <AdminSearch />
        </aside>

        {/* Main Content Area - Forms */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, Admin. Here you can manage your menu, chefs, and specials.
              </p>
            </div>
            
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-2xl h-auto gap-1 p-1">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="items">Menu Items</TabsTrigger>
                <TabsTrigger value="chefs">Chefs</TabsTrigger>
                <TabsTrigger value="specials">Specials</TabsTrigger>
              </TabsList>
              <div className="mt-6 p-4 sm:p-6 border border-border rounded-lg bg-card text-card-foreground shadow-sm overflow-x-hidden">
                <TabsContent value="categories">
                  <h3 className="text-lg font-bold mb-4">Add New Category</h3>
                  <CategoryForm />
                </TabsContent>
                <TabsContent value="items">
                  <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
                  <ItemForm />
                </TabsContent>
                <TabsContent value="chefs">
                  <h3 className="text-lg font-bold mb-4">Add New Chef</h3>
                  <ChefForm />
                </TabsContent>
                <TabsContent value="specials">
                  <h3 className="text-lg font-bold mb-4">Set Today's Special</h3>
                  <SpecialForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
