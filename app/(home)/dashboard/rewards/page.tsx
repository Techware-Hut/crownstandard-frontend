// app/(dashboard)/rewards/page.tsx
import RewardHeader from "@/components/Rewards/RewardHeader";
import MembershipCard from "@/components/Rewards/MembershipCard";
import RewardsTabs from "@/components/Rewards/RewardsTabs";
import RewardCard from "@/components/Rewards/RewardCard";

export default function RewardsPage() {
    return (
        <div className="min-h-screen container 3xl:max-w-[1280px] space-y-8">
            {/* Header */}
            <RewardHeader />

            {/* Membership summary */}
            <MembershipCard />

            {/* Tabs */}
            <RewardsTabs />
        </div>
    );
}
