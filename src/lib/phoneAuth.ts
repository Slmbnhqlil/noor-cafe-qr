"use client";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "./firebase";

// Türkiye telefon numarasını E.164 formatına çevirir (+90XXXXXXXXXX)
export function toE164TR(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10 || !d.startsWith("5")) return null;
  return "+90" + d;
}

let verifier: RecaptchaVerifier | null = null;

export function getRecaptcha(containerId: string): RecaptchaVerifier {
  if (verifier) return verifier;
  verifier = new RecaptchaVerifier(auth(), containerId, { size: "invisible" });
  return verifier;
}

export function resetRecaptcha() {
  try { verifier?.clear(); } catch { /* noop */ }
  verifier = null;
}

export async function sendOtp(phoneE164: string, containerId: string): Promise<ConfirmationResult> {
  const v = getRecaptcha(containerId);
  return signInWithPhoneNumber(auth(), phoneE164, v);
}
