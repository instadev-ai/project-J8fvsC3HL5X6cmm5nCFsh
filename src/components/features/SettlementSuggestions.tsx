
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface SettlementSuggestionsProps {
  expenses: Expense[];
  friends: Friend[];
}

interface Balance {
  friendId: string;
  amount: number; // Positive means they owe you, negative means you owe them
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const SettlementSuggestions = ({ expenses, friends }: SettlementSuggestionsProps) => {
  // Calculate balances
  const calculateBalances = (): Record<string, number> => {
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
    
    return balances;
  };

  // Generate settlement suggestions
  const generateSettlements = (): Settlement[] => {
    const balances = calculateBalances();
    const settlements: Settlement[] = [];
    
    // Create arrays of creditors (positive balance) and debtors (negative balance)
    const creditors: Balance[] = [];
    const debtors: Balance[] = [];
    
    Object.entries(balances).forEach(([friendId, amount]) => {
      if (amount > 0.01) {
        creditors.push({ friendId, amount });
      } else if (amount < -0.01) {
        debtors.push({ friendId, amount });
      }
    });
    
    // Sort by amount (absolute value, descending)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => a.amount - b.amount); // Negative values, so this is descending by absolute value
    
    // Generate settlements
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      // Calculate the settlement amount (minimum of what's owed and what's due)
      const amount = Math.min(creditor.amount, -debtor.amount);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.friendId,
          to: creditor.friendId,
          amount
        });
        
        // Update balances
        creditor.amount -= amount;
        debtor.amount += amount;
      }
      
      // Move to next creditor or debtor if their balance is settled
      if (creditor.amount < 0.01) i++;
      if (debtor.amount > -0.01) j++;
    }
    
    return settlements;
  };

  const settlements = generateSettlements();
  
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
      {settlements.length === 0 ? (
        <Alert>
          <AlertDescription>
            No settlements needed. Everyone is square!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Here are the most efficient ways to settle all debts with the fewest transactions:
          </p>
          
          {settlements.map((settlement, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-red-100 text-red-700 text-xs">
                  {getFriendInitials(settlement.from)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{getFriendName(settlement.from)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="font-mono font-medium">
                  ${settlement.amount.toFixed(2)}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                  {getFriendInitials(settlement.to)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{getFriendName(settlement.to)}</p>
              </div>
              
              <Button size="sm" variant="outline">
                Record
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettlementSuggestions;
