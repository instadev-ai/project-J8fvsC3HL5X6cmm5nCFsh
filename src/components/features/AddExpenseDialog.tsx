
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, MinusCircle, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friends: Friend[];
  onAddExpense: (expense: any) => void;
}

const AddExpenseDialog = ({ open, onOpenChange, friends, onAddExpense }: AddExpenseDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy("");
    setDate(new Date());
    setSelectedFriends([]);
    setSplitType("equal");
    setCustomSplits({});
  };

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleSplitChange = (friendId: string, value: string) => {
    setCustomSplits((prev) => ({
      ...prev,
      [friendId]: parseFloat(value) || 0,
    }));
  };

  const calculateSplits = () => {
    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) return {};
    
    // Include the payer in the split if they're not already selected
    const participantsIds = [...new Set([paidBy, ...selectedFriends])];
    
    if (splitType === "equal") {
      const splitAmount = totalAmount / participantsIds.length;
      return participantsIds.reduce((acc, id) => {
        acc[id] = parseFloat(splitAmount.toFixed(2));
        return acc;
      }, {} as Record<string, number>);
    } else {
      // For custom splits, ensure the total matches
      const currentTotal = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
      
      if (currentTotal === 0) {
        // If no custom splits are set, default to equal
        const splitAmount = totalAmount / participantsIds.length;
        return participantsIds.reduce((acc, id) => {
          acc[id] = parseFloat(splitAmount.toFixed(2));
          return acc;
        }, {} as Record<string, number>);
      }
      
      // Adjust the splits proportionally if they don't match the total
      if (currentTotal !== totalAmount) {
        const ratio = totalAmount / currentTotal;
        return Object.entries(customSplits).reduce((acc, [id, value]) => {
          acc[id] = parseFloat((value * ratio).toFixed(2));
          return acc;
        }, {} as Record<string, number>);
      }
      
      return customSplits;
    }
  };

  const handleSubmit = () => {
    if (!description || !amount || !paidBy || selectedFriends.length === 0) {
      return; // Form validation
    }

    const splits = calculateSplits();
    
    const newExpense = {
      description,
      amount: parseFloat(amount),
      paidBy,
      date: format(date, "yyyy-MM-dd"),
      participants: [...new Set([paidBy, ...selectedFriends])],
      splits,
    };

    onAddExpense(newExpense);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of your shared expense.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at Restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label>Split With</Label>
            <div className="grid grid-cols-2 gap-2">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`friend-${friend.id}`}
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={() => handleFriendToggle(friend.id)}
                  />
                  <Label htmlFor={`friend-${friend.id}`} className="cursor-pointer">
                    {friend.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Split Type</Label>
            <Select value={splitType} onValueChange={setSplitType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal Split</SelectItem>
                <SelectItem value="custom">Custom Split</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {splitType === "custom" && selectedFriends.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {[paidBy, ...selectedFriends].filter((id, index, self) => self.indexOf(id) === index).map((friendId) => {
                    const friend = friends.find((f) => f.id === friendId);
                    if (!friend) return null;
                    
                    return (
                      <div key={friendId} className="flex items-center gap-2">
                        <Label className="w-24">{friend.name}</Label>
                        <div className="flex items-center flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => {
                              const currentValue = customSplits[friendId] || 0;
                              if (currentValue > 0) {
                                handleSplitChange(friendId, (currentValue - 1).toString());
                              }
                            }}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={customSplits[friendId] || ""}
                            onChange={(e) => handleSplitChange(friendId, e.target.value)}
                            className="h-8 rounded-none text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => {
                              const currentValue = customSplits[friendId] || 0;
                              handleSplitChange(friendId, (currentValue + 1).toString());
                            }}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
