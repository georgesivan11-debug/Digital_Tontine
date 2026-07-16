"use client";

import { useState } from "react";
import { Plus, Calendar, MapPin, FileText, ArrowLeft, Send, UserCheck, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createMeeting, updateMeetingReport } from "@/app/actions/meetings";

type User = {
  id: string;
  name: string | null;
};

type Membership = {
  id: string;
  userId: string;
  user: User;
  role: string;
};

type Meeting = {
  id: string;
  date: Date;
  locationOrLink: string | null;
  minutesText: string | null;
  createdBy: User;
  secretary: User | null;
  secretaryId: string | null;
};

export default function MeetingsSection({
  groupId,
  isOrganizer,
  meetings,
  memberships,
  currentUserId,
}: {
  groupId: string;
  isOrganizer: boolean;
  meetings: Meeting[];
  memberships: Membership[];
  currentUserId: string;
}) {
  const [view, setView] = useState<"list" | "create" | "view" | "edit">("list");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateSchedule(formData: FormData) {
    setLoading(true);
    await createMeeting(formData);
    setLoading(false);
    setView("list");
  }

  async function handleSaveReport(formData: FormData) {
    setLoading(true);
    await updateMeetingReport(formData);
    setLoading(false);
    setView("list");
    setSelectedMeeting(null);
  }

  if (view === "create") {
    return (
      <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm animate-fade-in-up">
        <div className="flex items-center mb-6">
          <button onClick={() => setView("list")} className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900/50">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-bold">Schedule New Meeting</h2>
        </div>

        <form action={handleCreateSchedule} className="space-y-4">
          <input type="hidden" name="groupId" value={groupId} />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" name="date" required className="w-full px-4 py-2 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 rounded-xl outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Location (or Link)</label>
              <input type="text" name="location" placeholder="e.g., Google Meet or Paris Office" className="w-full px-4 py-2 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 rounded-xl outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Designate a Secretary</label>
              <p className="text-xs text-gray-500 mb-2">This person will be responsible for writing the meeting report.</p>
              <select name="secretaryId" required className="w-full px-4 py-2 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 rounded-xl outline-none focus:ring-2 focus:ring-gold-500">
                <option value="">Select a member...</option>
                {memberships.map(m => (
                  <option key={m.userId} value={m.userId}>
                    {m.user.name} {m.userId === currentUserId ? "(You)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === "edit" && selectedMeeting) {
    return (
      <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm animate-fade-in-up">
        <div className="flex items-center mb-6">
          <button onClick={() => setView("list")} className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900/50">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-bold">Write Meeting Report</h2>
        </div>

        <form action={handleSaveReport} className="space-y-4">
          <input type="hidden" name="groupId" value={groupId} />
          <input type="hidden" name="meetingId" value={selectedMeeting.id} />
          <input type="hidden" name="report" value={reportText} />
          
          <div className="pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Editor */}
              <textarea 
                className="w-full h-64 p-4 border border-gray-200 dark:border-blue-900 bg-gray-50 dark:bg-blue-900/20 rounded-xl outline-none focus:ring-2 focus:ring-gold-500 resize-none font-mono text-sm"
                placeholder="# Agenda&#10;- Discussed late fees&#10;- Next host chosen"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
              
              {/* Preview */}
              <div className="w-full h-64 p-4 border border-gray-200 dark:border-blue-900 bg-white dark:bg-blue-950 rounded-xl overflow-y-auto prose prose-sm dark:prose-invert">
                {reportText ? (
                  <ReactMarkdown>{reportText}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">Preview will appear here...</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gold-400 text-blue-950 font-bold rounded-full hover:bg-gold-300 transition-colors shadow-md flex items-center">
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Report"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === "view" && selectedMeeting) {
    return (
      <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => { setView("list"); setSelectedMeeting(null); }} className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900/50">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h2 className="text-lg font-bold">Meeting Report</h2>
              <p className="text-xs text-gray-500">Secretary: {selectedMeeting.secretary?.name || "None"}</p>
            </div>
          </div>
          {(selectedMeeting.secretaryId === currentUserId || isOrganizer) && (
            <button 
              onClick={() => { setReportText(selectedMeeting.minutesText || ""); setView("edit"); }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-bold rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" /> Edit
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {new Date(selectedMeeting.date).toLocaleDateString()}
          </div>
          {selectedMeeting.locationOrLink && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-coral-500" />
              {selectedMeeting.locationOrLink}
            </div>
          )}
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-blue-950">
          <ReactMarkdown>{selectedMeeting.minutesText || "*No detailed report provided yet.*"}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-blue-950 rounded-2xl p-6 border border-gray-100 dark:border-blue-900 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center">
          <FileText className="w-5 h-5 mr-2 text-coral-500" />
          Meetings & Reports
        </h2>
        {isOrganizer && (
          <button onClick={() => setView("create")} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Plus className="w-3 h-3 mr-1" /> Schedule
          </button>
        )}
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No meetings scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => {
            const hasReport = !!meeting.minutesText && meeting.minutesText.trim().length > 0;
            const isSecretary = meeting.secretaryId === currentUserId;
            
            return (
              <div 
                key={meeting.id} 
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-blue-900/10"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-white dark:bg-blue-950 rounded-lg shadow-sm mr-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Meeting of {new Date(meeting.date).toLocaleDateString()}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Secretary: {meeting.secretary?.name || "Pending"}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isSecretary && !hasReport && (
                    <button 
                      onClick={() => { setSelectedMeeting(meeting); setReportText(meeting.minutesText || ""); setView("edit"); }}
                      className="px-3 py-1.5 bg-gold-400 text-blue-950 text-xs font-bold rounded-full hover:bg-gold-300 transition-colors"
                    >
                      Write Report
                    </button>
                  )}
                  
                  {hasReport ? (
                    <button 
                      onClick={() => { setSelectedMeeting(meeting); setView("view"); }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Read Report
                    </button>
                  ) : (
                    !isSecretary && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        Report Pending
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
