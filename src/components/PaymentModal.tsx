import React, { useState } from "react";
import {
  X,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { sound } from "../utils/audio";
import {
  PAYMENT_DETAILS,
  confirmStudentPayment,
  simulateNextDayForTesting,
  resetTrialForTesting,
} from "../utils/storage";
import { AccessStatus } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessStatus: AccessStatus;
  onPaymentConfirmed: () => void;
  onStatusUpdated?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  accessStatus,
  onPaymentConfirmed,
  onStatusUpdated,
}) => {
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [bankName, setBankName] = useState("OPay");
  const [transferRef, setTransferRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber);
    setCopied(true);
    sound.playSelect();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      confirmStudentPayment({
        senderName: senderName || "Student",
        bankName,
        reference: transferRef || `TRANS-${Date.now().toString().slice(-6)}`,
      });
      sound.playSuccess();
      setIsSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        setSuccessMessage(false);
        onPaymentConfirmed();
        onClose();
      }, 1500);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ashamu Adefunke, I have transferred ₦500 for my QUIZMASTER AI account.
Bank: OPAY
Account Name: ASHAMU ADEFUNKE TEMITOPE
Account Number: 8035332548
Sender: ${senderName || "Student"}
Sender Bank: ${bankName}`
  );

  const whatsappUrl = `https://wa.me/2348035332548?text=${whatsappMessage}`;

  return (
    <div
      id="payment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="payment-modal-container"
        className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-payment-modal-btn"
          onClick={() => {
            sound.playSelect();
            onClose();
          }}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Official Exam Access Activation</span>
          </span>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            ₦500
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {accessStatus.isPaymentRequired
            ? "Day 1 Free Access Completed"
            : "Activate Full Exam Prep Access"}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Students enjoy full free access on their first day of exams. Starting the next day, a one-time contribution of{" "}
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₦500 (Five Hundred Naira)</strong> unlocks unlimited CBT exams, AI explanations, and coaching.
        </p>

        {/* Bank Details Card */}
        <div
          id="bank-details-card"
          className="mt-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 to-teal-50/30 p-5 dark:border-emerald-500/40 dark:from-emerald-950/30 dark:to-slate-900"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 dark:border-emerald-800/60">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4" />
              Direct Bank Transfer Details
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Instant Activation
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {/* Bank Name */}
            <div className="flex items-center justify-between rounded-xl bg-white/90 p-3.5 shadow-xs dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Bank Name
                </span>
                <span className="text-lg sm:text-xl font-black tracking-wide text-emerald-700 dark:text-emerald-400">
                  {PAYMENT_DETAILS.bankName}
                </span>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                OPay Digital Services
              </span>
            </div>

            {/* Account Number with Copy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white/90 p-3.5 shadow-xs dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900">
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block uppercase">
                  Account Number
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white font-mono">
                  {PAYMENT_DETAILS.accountNumber}
                </span>
              </div>
              <button
                id="copy-account-number-btn"
                type="button"
                onClick={handleCopyAccountNumber}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Account No.</span>
                  </>
                )}
              </button>
            </div>

            {/* Account Name */}
            <div className="rounded-xl bg-white/90 p-3 shadow-xs dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block uppercase">
                Account Name
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {PAYMENT_DETAILS.accountName}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between rounded-xl bg-white/90 p-3 shadow-xs dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900">
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block uppercase">
                  Amount Due
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₦500 Naira
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Any Nigerian Bank / OPay / PalmPay
              </span>
            </div>
          </div>
        </div>

        {/* Benefits reminder */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            What your ₦500 unlocks:
          </div>
          <ul className="grid grid-cols-2 gap-1 mt-1 text-[11px]">
            <li className="flex items-center gap-1">✓ Unlimited JAMB, WAEC, NECO CBT</li>
            <li className="flex items-center gap-1">✓ AI Step-by-Step Rationales</li>
            <li className="flex items-center gap-1">✓ AI Personal Exam Coach</li>
            <li className="flex items-center gap-1">✓ Performance Analytics</li>
          </ul>
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleConfirmTransfer} className="mt-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Confirm Your Transfer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Sender Name (as shown in your bank)
              </label>
              <input
                id="payment-sender-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g., Funke Ashamu"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                Bank Sent From
              </label>
              <select
                id="payment-bank-select"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {PAYMENT_DETAILS.supportedBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Transaction Ref / Remarks (Optional)
            </label>
            <input
              id="payment-reference"
              type="text"
              value={transferRef}
              onChange={(e) => setTransferRef(e.target.value)}
              placeholder="e.g. Session ID or Transfer note"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Payment recorded! Full exam prep access unlocked.</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="submit-confirm-payment-btn"
              type="submit"
              disabled={isSubmitting || successMessage}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>I Have Sent ₦500 — Unlock Now</span>
                </>
              )}
            </button>

            <a
              id="whatsapp-confirm-link"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              title="Notify Ashamu Adefunke on WhatsApp"
            >
              <Smartphone className="h-4 w-4 text-emerald-600" />
              <span>Notify on WhatsApp</span>
            </a>
          </div>
        </form>

        {/* Demo / Testing Controls Toggle */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Testing shortcuts:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                simulateNextDayForTesting();
                sound.playSelect();
                if (onStatusUpdated) onStatusUpdated();
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              title="Test Day 2 Locked state"
            >
              Simulate Day 2 (Locked)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                resetTrialForTesting();
                sound.playSelect();
                if (onStatusUpdated) onStatusUpdated();
                onClose();
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              title="Reset trial to fresh Day 1"
            >
              Reset to Day 1 Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
