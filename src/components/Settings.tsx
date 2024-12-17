import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface SettingsProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  isDyslexicFont: boolean;
  onToggleDyslexicFont: () => void;
}

const Settings = ({
  currentLanguage,
  onLanguageChange,
  isDyslexicFont,
  onToggleDyslexicFont
}: SettingsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-[rgba(234,56,76,0.1)]">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[#141414] border border-[#2a2a2a]">
          <DropdownMenuItem
            onClick={onToggleDyslexicFont}
            className="text-white hover:bg-[rgba(234,56,76,0.1)] cursor-pointer"
          >
            {isDyslexicFont ? 'Disable' : 'Enable'} Dyslexic Font
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Settings;