
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, DollarSign, Users, Clock, ArrowRightLeft } from "lucide-react";
import AddExpenseDialog from "@/components/features/AddExpenseDialog";
import ExpenseList from "@/components/features/ExpenseList";
import BalanceSummary from "@/components/features/BalanceSummary";
import SettlementSuggestions from "@/components/features/SettlementSuggestions";
import FriendsList from "@/components/features/FriendsList";

// Mock data for initial development
const mockFriends = [
  { id: "1", name: "Alex", email: "alex@example.com" },
  { id: "2", name: "Taylor", email: "taylor@example.com" },
  { id: "3", name: "Jordan", email: "jordan@example.com" },
  { id: "4", name: "Casey", email: "casey@example.com" },
];

const mockExpenses = [
  { 
    id: "1", 
    description: "Dinner at Italian Restaurant", 
    amount: 120, 
    paidBy: "1", 
    date: "2023-06-15", 
    participants: ["1", "2", "3"],
    splits: { "1": 40, "2": 40, "3": 40 }
  },
  { 
    id: "2", 
    description: "Movie Tickets", 
    amount: 48, 
    paidBy: "2", 
    date: "2023-06-10", 
    participants: ["1", "2", "4"],
    splits: { "1": 16, "2": 16, "4": 16 }
  },
  { 
    id: "3", 
    description: "Groceries", 
    amount: 75.50, 
    paidBy: "3", 
    date: "2023-06-05", 
    participants: ["1", "3", "4"],
    splits: { "1": 25.17, "3": 25.17, "4": 25.16 }
  },
];

const Index = () => {
  const [friends] = useState(mockFriends);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const addExpense = (newExpense) => {
    setExpenses([...expenses, { ...newExpense, id: (expenses.length + 1).toString() }]);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">SplitWise</h1>
          <p className="text-muted-foreground">Split bills with friends, easily</p>
        </div>
        <Button onClick={() => setIsAddExpenseOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Expense
        </Button>
      </header>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="settle">Settle Up</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$47.33</div>
                <p className="text-xs text-muted-foreground">You are owed $65.50 and you owe $18.17</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{friends.length}</div>
                <div className="flex -space-x-2 mt-2">
                  {friends.map((friend) => (
                    <Avatar key={friend.id} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenses.length}</div>
                <p className="text-xs text-muted-foreground">Expenses in the last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Balance Summary</CardTitle>
              <CardDescription>See who owes you and who you owe</CardDescription>
            </CardHeader>
            <CardContent>
              <BalanceSummary expenses={expenses} friends={friends} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="#expenses">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              <ExpenseList expenses={expenses} friends={friends} limit={3} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>History of all your shared expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseList expenses={expenses} friends={friends} />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsAddExpenseOpen(true)} className="w-full gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Expense
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
              <CardDescription>Manage your friends and see balances</CardDescription>
            </CardHeader>
            <CardContent>
              <FriendsList friends={friends} expenses={expenses} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Friend
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settlement Suggestions</CardTitle>
              <CardDescription>The most efficient way to settle debts</CardDescription>
            </CardHeader>
            <CardContent>
              <SettlementSuggestions expenses={expenses} friends={friends} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Record a Settlement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AddExpenseDialog 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen} 
        friends={friends}
        onAddExpense={addExpense}
      />
    </div>
  );
};

export default Index;
