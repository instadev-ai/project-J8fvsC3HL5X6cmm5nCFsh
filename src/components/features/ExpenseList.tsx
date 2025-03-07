
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface ExpenseListProps {
  expenses: Expense[];
  friends: Friend[];
  limit?: number;
}

const ExpenseList = ({ expenses, friends, limit }: ExpenseListProps) => {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...displayExpenses].sort((a, b) => 
    parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

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
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No expenses found. Add your first expense!
        </div>
      ) : (
        sortedExpenses.map((expense) => (
          <Card key={expense.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4 gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getFriendInitials(expense.paidBy)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm truncate">{expense.description}</h3>
                      <p className="text-xs text-muted-foreground">
                        {getFriendName(expense.paidBy)} paid ${expense.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">${expense.amount.toFixed(2)}</div>
                      <time className="text-xs text-muted-foreground">
                        {format(parseISO(expense.date), "MMM d, yyyy")}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 px-4 py-2 text-xs">
                <div className="flex flex-wrap gap-1">
                  <span className="text-muted-foreground">Split between:</span>
                  {expense.participants.map((participantId) => (
                    <Badge key={participantId} variant="outline" className="font-normal">
                      {getFriendName(participantId)} (${expense.splits[participantId]?.toFixed(2) || "0.00"})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
