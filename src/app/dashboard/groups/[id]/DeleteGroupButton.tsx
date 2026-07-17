"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteTontineGroup } from "@/app/actions/groups";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tontine ? Cette action est irréversible et supprimera tout l'historique !")) {
      setLoading(true);
      try {
        await deleteTontineGroup(groupId);
      } catch (e: any) {
        if (e.message !== "NEXT_REDIRECT" && !e.digest?.startsWith("NEXT_REDIRECT")) {
          alert("Erreur lors de la suppression : " + e.message);
          setLoading(false);
        }
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold text-sm rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
