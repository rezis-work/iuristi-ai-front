import Seetings from "@/src/features/user-account/profile/components/seetings";
import { EmailVerificationSection } from "@/src/features/user-account/email-verification/components/email-verification-section";
import { PasswordChnage } from "@/src/features/user-account/change-password/components/password-chnage";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <EmailVerificationSection />
      <Seetings />
      <PasswordChnage />
    </div>
  );
}
