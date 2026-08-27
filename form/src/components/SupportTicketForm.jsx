
import React, { useState, useEffect, useMemo } from 'react';
import { departments } from '../data/mockData';
import { Ticket, Send, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
const SupportTicketForm = () => {
    const [formData, setFormData] = useState({
        department: '',
        issueType: '',
        description: '',
        ccEmails: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    // Get current department object
    const selectedDept = useMemo(() =>
        departments.find(d => d.label === formData.department),
        [formData.department]
    );
    // Sorted issues for the selected department
    const sortedIssues = useMemo(() => {
        if (!selectedDept) return [];
        return [...selectedDept.issues].sort((a, b) => a.label.localeCompare(b.label));
    }, [selectedDept]);
    // Handle Department Change
    const handleDepartmentChange = (e) => {
        const val = e.target.value;
        setFormData({
            ...formData,
            department: val,
            issueType: '', // Reset issue type
            description: '' // Reset description when department changes
        });
        setErrors({ ...errors, department: '' });
    };
    // Handle Issue Type Change
    const handleIssueChange = (e) => {
        const val = e.target.value;
        const issueObj = sortedIssues.find(i => i.label === val);

        setFormData({
            ...formData,
            issueType: val,
            description: issueObj?.template || '' // Auto-fill template if exists
        });
        setErrors({ ...errors, issueType: '' });
    };
    // Handle Description Change
    const handleDescriptionChange = (e) => {
        const val = e.target.value;
        if (val.length <= 255) {
            setFormData({ ...formData, description: val });
        }
    };
    // Validation Logic
    const isFormValid = formData.department && formData.issueType && formData.description.trim() !== '';
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('--- Form Submitted ---');
            console.table(formData);
            setIsSubmitted(true);

            // Reset after 3 seconds for demo
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ department: '', issueType: '', description: '', ccEmails: '' });
            }, 3000);
        }
    };
    const hasTemplate = useMemo(() => {
        const issue = sortedIssues.find(i => i.label === formData.issueType);
        return !!issue?.template;
    }, [formData.issueType, sortedIssues]);
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="bg-brand-600 p-6 text-white text-center sm:text-left flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Support Ticket</h1>
                        <p className="text-brand-100 text-sm">Fill in the details to get assistance</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Department Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            Department <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.department}
                                onChange={handleDepartmentChange}
                                className={`w-full appearance-none bg-slate-50 border ${formData.department ? 'border-brand-200' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer`}
                            >
                                <option value="" disabled>Select a department</option>
                                {departments.map((dept) => (
                                    <option key={dept.label} value={dept.label}>{dept.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                        </div>
                    </div>
                    {/* Issue Type Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            Issue Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.issueType}
                                onChange={handleIssueChange}
                                disabled={!formData.department}
                                className={`w-full appearance-none bg-slate-50 border ${formData.issueType ? 'border-brand-200' : 'border-slate-200'} ${!formData.department ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
                            >
                                <option value="" disabled>Select an issue</option>
                                {sortedIssues.map((issue) => (
                                    <option key={issue.label} value={issue.label}>{issue.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        {!formData.department && (
                            <p className="text-[11px] text-slate-400 italic">Select a department first</p>
                        )}
                    </div>
                    {/* Ticket Description */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Description <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[11px] font-medium ${formData.description.length >= 240 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {formData.description.length}/255
                            </span>
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Provide details about your issue..."
                            rows={5}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none scroll-smooth"
                        />
                        {hasTemplate && (
                            <div className="flex items-start gap-2 p-2.5 bg-brand-50 rounded-lg border border-brand-100 animate-fade-in">
                                <AlertCircle className="w-4 h-4 text-brand-600 mt-0.5" />
                                <p className="text-xs text-brand-700 leading-relaxed font-medium">
                                    We've pre-filled a template for you. Please complete the details above.
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Optional CC Emails */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">
                            CC Emails <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.ccEmails}
                            onChange={(e) => setFormData({ ...formData, ccEmails: e.target.value })}
                            placeholder="manager@example.com, it-leads@example.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono text-sm"
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitted}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-[0.98] ${isFormValid && !isSubmitted
                                ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                                : 'bg-slate-300 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {isSubmitted ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                                Submitted successfully!
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Ticket
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default SupportTicketForm;