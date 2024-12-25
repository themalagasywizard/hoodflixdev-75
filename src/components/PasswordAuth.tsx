import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

const PasswordAuth = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const correctPassword = 'ihub2024'; // In a real app, this would be stored securely

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      onAuthenticated();
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
            autoFocus
          />
          <Button type="submit" className="w-full bg-[#ea384c] hover:bg-[#ff4d63]">
            Access iHub
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordAuth;