{/* components/SettingsDialog.tsx */}
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, // Will be replaced later
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Will be replaced later
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  useChapters: boolean;
  setUseChapters: (value: boolean) => void;
  selectedModel: string;
  handleSelectChange: (value: string) => void; // Will be adjusted for DropdownMenu
  apiKey: string;
  handleApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  useChapters,
  setUseChapters,
  selectedModel,
  handleSelectChange,
  apiKey,
  handleApiKeyChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in bg-white dark:bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your summarization preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="useChapters"
              checked={useChapters}
              onCheckedChange={(checked) => setUseChapters(checked as boolean)}
              className="data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="useChapters"
              className="text-sm font-medium leading-none"
            >
              Use Chapters
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Use model to summarize:
            </label>
            {/* --- SELECT TO BE REPLACED --- */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between glass-card">
                  {selectedModel}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="glass-card w-full">
                <DropdownMenuItem onClick={() => handleSelectChange("gpt-4o-mini")}>
                  gpt-4o-mini
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSelectChange("deepseek-chat")}>
                  deepseek-chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
             {/* --- END SELECT --- */}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              API Key ({selectedModel})
            </label>
            <Input
              type="text"
              placeholder={`Enter your ${selectedModel} API key`}
              value={apiKey}
              onChange={handleApiKeyChange}
              className="glass-input"
            />
          </div>

          <Card className="glass-card border-border/40">
            <CardContent className="pt-6">
              <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                <li>An API key is required to use this app.</li>
                <li>Don&apos;t have an OpenAPI key? <a href="https://platform.openai.com/" target="_blank" rel="noopener" className="text-primary hover:underline">Sign up</a> for access.</li>
                <li>Don&apos;t have a DeepSeek API key? <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener" className="text-primary hover:underline">Sign up</a> for access.</li>
                <li>Your key is stored only in your browser for convenience.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}
            className="glass-card hover:bg-secondary/50">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};