
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  participants: string[];
  splits: Record<string, number>;
}

interface FriendsListProps {
  friends: Friend[];
  expenses: Expense[];
}

const FriendsList = ({ friends, expenses }: FriendsListProps) => {
  // Calculate balances for each friend
  const calculateBalance = (friendId: string): number => {
    let balance = 0;
    
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      
      // If this friend paid for the expense
      if (paidBy === friendId) {
        // Add what others owe this friend
        Object.entries(expense.splits).forEach(([participantId, amount]) => {
          if (participantId !== friendId) {
            balance += amount;
          }
        });
      } 
      // If this friend participated in the expense but didn't pay
      else if (expense.participants.includes(friendId)) {
        // Subtract what this friend owes the payer
        balance -= expense.splits[friendId] || 0;
      }
    });
    
    return balance;
  };

  return (
    <div className="space-y-4">
      {friends.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No friends added yet. Add your first friend to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {friends.map((friend) => {
            const balance = calculateBalance(friend.id);
            const isPositive = balance >= 0;
            
            return (
              <Card key={friend.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback className={`${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {friend.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{friend.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{friend.email}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {balance !== 0 && (
                        <div className={`font-mono font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{balance.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {balance === 0 && 'Settled up'}
                        {balance > 0 && 'Owes you'}
                        {balance < 0 && 'You owe'}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          View Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Settle Up
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit Friend
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove Friend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {balance !== 0 && (
                    <div className={`px-4 py-2 text-xs ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {isPositive ? (
                        <div className="flex items-center">
                          <span>{friend.name} owes you ${balance.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>You owe {friend.name} ${Math.abs(balance).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
