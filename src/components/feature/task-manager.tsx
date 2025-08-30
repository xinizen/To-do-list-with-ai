"use client";

import { useState, useTransition, type FC, type FormEvent } from "react";
import { suggestTopPriorities } from "@/ai/flows/suggest-top-priorities";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, WandSparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskItem } from "./task-item";
import { Separator } from "@/components/ui/separator";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, text: "Design the user interface mockups", completed: true },
  { id: 2, text: "Develop the main task management component", completed: false },
  { id: 3, text: "Integrate Gemini for AI priority suggestions", completed: false },
  { id: 4, text: "Set up client-side state management", completed: false },
  { id: 5, text: "Style the application using the chosen color palette", completed: false },
];

export const TaskManager: FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inputValue, setInputValue] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      toast({
        title: "Empty Task",
        description: "Please enter a task before adding.",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setInputValue("");
  };

  const handleGetSuggestions = () => {
    const uncompletedTasks = tasks
      .filter((t) => !t.completed)
      .map((t) => t.text);
      
    if (uncompletedTasks.length < 3) {
      toast({
        title: "Not Enough Tasks",
        description: "Please add at least 3 uncompleted tasks to get suggestions.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await suggestTopPriorities({ tasks: uncompletedTasks });
        setPriorities(result.priorities);
        toast({
            title: "Priorities Suggested!",
            description: "AI has highlighted your top 3 tasks."
        })
      } catch (error) {
        console.error("Error getting suggestions:", error);
        toast({
          title: "AI Error",
          description: "Could not get suggestions from AI. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="w-full shadow-2xl shadow-primary/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <WandSparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">TaskPilot AI</CardTitle>
            <CardDescription>Your intelligent to-do list</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            aria-label="New task input"
          />
          <Button type="submit" size="icon" aria-label="Add task">
            <Plus className="h-5 w-5" />
          </Button>
        </form>
        <div className="mt-6 space-y-2">
          {uncompletedTasks.length > 0 ? (
            uncompletedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isPriority={priorities.includes(task.text)}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          ) : (
             <p className="text-center text-sm text-muted-foreground py-4">All tasks completed! ✨</p>
          )}

          {completedTasks.length > 0 && uncompletedTasks.length > 0 && <Separator className="my-4" />}

          {completedTasks.length > 0 && (
            <>
              <h3 className="text-xs font-semibold uppercase text-muted-foreground px-3 pt-2">Completed</h3>
              {completedTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isPriority={false}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                />
                ))}
            </>
          )}

        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGetSuggestions}
          disabled={isPending || tasks.filter(t => !t.completed).length < 3}
          className="w-full"
        >
          <WandSparkles className="mr-2 h-4 w-4" />
          {isPending ? "Thinking..." : "Suggest Top 3 Priorities"}
        </Button>
      </CardFooter>
    </Card>
  );
};
