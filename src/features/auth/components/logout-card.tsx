"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Wrapper from "@/src/components/shared/wrapper";
import { useMe } from "../hook/use-getme";
import { useLogOut } from "../hook/auth";
import { User, Mail, LogOut } from "lucide-react";

interface LogoutCardProps {
  onClose?: () => void;
}

export function LogoutCard({ onClose }: LogoutCardProps) {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogOut();

  function onLogout() {
    logout(undefined, {
      onSuccess: () => {
        // Close the dropdown after successful logout
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 100);
        }
      },
    });
  }

  return (
    <Wrapper className="mx-auto">
      <div className="w-full md:max-w-xl mx-auto">
        <Card className="bg-gray-900/95 backdrop-blur-sm shadow-2xl border-gray-800/50 py-20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              You are signed in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info Section */}
            <div className="space-y-4 pb-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="w-10 h-10 rounded-full bg-[#FF9D4D]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#FF9D4D]" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Name</p>
                  <p className="text-white text-base font-semibold">
                    {user?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="w-10 h-10 rounded-full bg-[#FF9D4D]/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#FF9D4D]" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Email</p>
                  <p className="text-white text-base font-semibold">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={onLogout}
              disabled={isPending}
              variant="destructive"
              className="w-full h-[52px] transition-all duration-200 font-semibold text-base rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isPending ? "Logging out..." : "Logout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
