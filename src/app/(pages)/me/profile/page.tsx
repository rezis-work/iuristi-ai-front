import ProfileMe from "@/src/features/user-account/profile/components/profile";
import Seetings from "@/src/features/user-account/profile/components/seetings";

function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileMe />
      <Seetings />
    </div>
  );
}

export default ProfilePage;
