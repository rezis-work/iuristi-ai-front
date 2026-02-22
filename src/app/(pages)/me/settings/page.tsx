import Seetings from "@/src/features/user-account/profile/components/seetings";
import { EmailVerificationSection } from "@/src/features/user-account/email-verification/components/email-verification-section";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <EmailVerificationSection />
      <Seetings />
    </div>
  );
}
