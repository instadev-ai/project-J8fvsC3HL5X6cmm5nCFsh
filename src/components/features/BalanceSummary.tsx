
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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

interface BalanceSummaryProps {
  expenses: Expense[];
  friends: Friend[];
}

interface Balance {
  friendId: string;
  amount: number; // Positive means they owe you, negative means you owe them
}

const BalanceSummary = ({ expenses, friends }: BalanceSummaryProps) => {
  // Calculate balances
  const calculateBalances = (): Balance[] => {
    const balances: Record<string, number> = {};
    
    // Initialize balances for all friends
    friends.forEach(friend => {
      balances[friend.id] = 0;
    });
    
    // Process each expense
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      
      // For each participant in the expense
      Object.entries(expense.splits).forEach(([participantId, amount]) => {
        if (participantId === paidBy) return; // Skip if the participant is the payer
        
        // The payer is owed money by the participant
        balances[paidBy] += amount;
        // The participant owes money to the payer
        balances[participantId] -= amount;
      });
    });
    
    // Convert to array format
    return Object.entries(balances)
      .map(([friendId, amount]) => ({ friendId, amount }))
      .filter(balance => Math.abs(balance.amount) > 0.01) // Filter out zero balances
      .sort((a, b) => b.amount - a.amount); // Sort by amount (highest first)
  };

  const balances = calculateBalances();
  
  const getFriendName = (id: string) => {
    const friend = friends.find(f => f.id === id);
    return friend ? friend.name : "Unknown";
  };

  const getFriendInitials = (id: string) => {
    const name = getFriendName(id);
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {balances.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No balances to settle. You're all square!
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {/* People who owe you */}
          <Card className="overflow-hidden">
            <div className="bg-green-50 dark:bg-green-950 px-4 py-2 border-b">
              <h3 className="font-medium text-green-700 dark:text-green-300">They owe you</h3>
            </div>
            <CardContent className="p-0">
              {balances
                .filter(balance => balance.amount > 0)
                .map(balance => (
                  <div key={balance.friendId} className="flex items-center p-3 border-b last:border-0">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                        {getFriendInitials(balance.friendId)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{getFriendName(balance.friendId)}</p>
                    </div>
                    <div className="font-mono font-medium text-green-700 dark:text-green-400">
                      ${balance.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              {balances.filter(balance => balance.amount > 0).length === 0 && (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  No one owes you money
                </div>
              )}
            </CardContent>
          </Card>

          {/* People you owe */}
          <Card className="overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950 px-4 py-2 border-b">
              <h3 className="font-medium text-red-700 dark:text-red-300">You owe them</h3>
            </div>
            <CardContent className="p-0">
              {balances
                .filter(balance => balance.amount < 0)
                .map(balance => (
                  <div key={balance.friendId} className="flex items-center p-3 border-b last:border-0">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-red-100 text-red-700 text-xs">
                        {getFriendInitials(balance.friendId)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">{getFriendName(balance.friendId)}</p>
                    </div>
                    <div className="font-mono font-medium text-red-700 dark:text-red-400">
                      ${Math.abs(balance.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              {balances.filter(balance => balance.amount < 0).length === 0 && (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  You don't owe anyone
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BalanceSummary;
