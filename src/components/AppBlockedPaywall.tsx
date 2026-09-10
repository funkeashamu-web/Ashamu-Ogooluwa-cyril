import React, { useState } from "react";
import {
  Lock,
  Copy,
  Check,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { AccessStatus } from "../types";
import {
  PAYMENT_DETAILS,
  confirmStudentPayment,
  resetTrialForTesting,
  simulateNextDayForTesting,
  simulatePaidForTesting,
} from "../utils/storage";
import { sound } from "../utils/audio";

interface AppBlockedPaywallProps {
  accessStatus: AccessStatus;
  onPaymentConfirmed: () => void;
  onStatusChange: () => void;
}

export function AppBlockedPaywall({
  accessStatus,
  onPaymentConfirmed,
  onStatusChange,
}: AppBlockedPaywallProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [bankName, setBankName] = useState("OPay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sound.playSelect();

    setTimeout(() => {
      confirmStudentPayment({
        senderName: senderName.trim() || "Student",
        bankName,
      });
      sound.playSuccess();
      setIsSubmitting(false);
      setSuccessMessage("Transfer confirmed! QUIZMASTER AI is now fully unblocked.");
      setTimeout(() => {
        onPaymentConfirmed();
      }, 900);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ashamu Adefunke, I have transferred ₦500 for my QUIZMASTER AI account.
Bank: OPAY
Account Name: ASHAMU ADEFUNKE TEMITOPE
Account Number: 8035332548
Sender: ${senderName.trim() || "Student"}
Sender Bank: ${bankName}`
  );

  const whatsappUrl = `https://wa.me/2348035332548?text=${whatsappMessage}`;

  return (
    <div
      id="app-blocked-paywall"
      className="mx-auto max-w-4xl py-6 sm:py-12 px-4 animate-fadeIn"
    >
      {/* Main Lock Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/80 bg-white p-6 sm:p-10 shadow-2xl dark:border-amber-500/60 dark:bg-slate-900">
        {/* Glow Accent */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/20 via-emerald-400/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/10 to-transparent blur-3xl pointer-events-none" />

        {/* Header Badge & Title */}
        <div className="relative text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 ring-8 ring-amber-500/5">
            <Lock className="h-10 w-10 sm:h-12 sm:w-12 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>Free Day 1 Trial Ended • App Locked</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              QUIZMASTER AI IS LOCKED
            </h1>

            <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Your free Day 1 trial has expired. To continue taking CBT examinations
              (<strong>JAMB, WAEC, NECO, BECE</strong>), generating custom tests, and
              accessing AI explanations, please make a one-time transfer of{" "}
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-base">
                ₦500
              </strong>{" "}
              to unblock the app permanently.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 animate-fadeIn">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-bold">{successMessage}</p>
          </div>
        )}

        {/* Payment Details Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Bank Account Card */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-white p-5 sm:p-6 border border-emerald-200 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-slate-900 dark:border-emerald-900/60">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 dark:border-emerald-900/60">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Transfer Destination
                </span>
                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                  ₦500 Lifetime
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* Bank Name */}
                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Bank Name
                    </span>
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                      {PAYMENT_DETAILS.bankName}
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    OPay
                  </span>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-xs dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Account Number
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wider">
                      {PAYMENT_DETAILS.accountNumber}
                    </span>
                  </div>
                  <button
                    id="copy-account-paywall-btn"
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Account Name */}
                <div className="rounded-xl bg-white p-3 shadow-xs dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Account Name
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {PAYMENT_DETAILS.accountName}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Verification Link */}
            <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Verify Receipt via WhatsApp</span>
              </a>
              <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                Official WhatsApp: 08035332548
              </p>
            </div>
          </div>

          {/* Right Column: Instant Unblock Form */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl bg-slate-50/80 p-5 sm:p-6 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Confirm Transfer & Unblock App</span>
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Once you make the ₦500 transfer, enter your name below to immediately
                unlock all tests and AI tutor features.
              </p>

              <form onSubmit={handleConfirmPayment} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="sender-name-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Sender Name (on Bank Transfer)
                  </label>
                  <input
                    id="sender-name-input"
                    type="text"
                    required
                    placeholder="e.g. Funke Ashamu"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sender-bank-select"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    Bank You Sent From
                  </label>
                  <select
                    id="sender-bank-select"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {PAYMENT_DETAILS.supportedBanks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  id="confirm-unblock-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-black text-white hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Transfer...</span>
                  ) : (
                    <>
                      <span>Confirm ₦500 & Unblock App</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-xl bg-amber-50/80 p-3 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                ⚡ <strong>Instant Unblock:</strong> Once submitted, your app will unlock
                immediately so you can continue your examination preparation without delay.
              </p>
            </div>
          </div>
        </div>

        {/* Demo / Tester Quick Controls */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold">
            Tester Simulation Controls:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                resetTrialForTesting();
                onStatusChange();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset to Day 1 Free</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                simulateNextDayForTesting();
                onStatusChange();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
            >
              <Lock className="h-3 w-3" />
              <span>Simulate Day 2 Block</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                simulatePaidForTesting();
                onPaymentConfirmed();
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700 shadow-xs"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Quick Unblock (Paid)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
