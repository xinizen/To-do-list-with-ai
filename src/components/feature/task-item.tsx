"use client";

import type { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  isPriority: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: FC<TaskItemProps> = ({
  task,
  isPriority,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <div className="animate-fade-in-down flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id, task.completed)}
        aria-label={`Mark task "${task.text}" as ${
          task.completed ? "incomplete" : "complete"
        }`}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={cn(
          "flex-grow cursor-pointer text-sm font-medium transition-all duration-300",
          task.completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {task.text}
      </label>
      {isPriority && !task.completed && (
        <Badge variant="outline" className="border-accent text-accent animate-fade-in-down">
          Priority
        </Badge>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.text}"`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
