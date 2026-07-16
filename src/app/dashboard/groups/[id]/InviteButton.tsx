"use client";

import { PlusCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function InviteButton({ groupId }: { groupId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/invite/${groupId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center px-4 py-2.5 rounded-full bg-gold-400 text-blue-950 text-sm font-semibold hover:bg-gold-300 transition-colors shadow-md"
    >
      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
      {copied ? "Link Copied!" : "Invite Members"}
    </button>
  );
}
