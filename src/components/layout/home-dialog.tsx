"use client";

import { useState, useEffect } from "react";
import { Mail, Linkedin, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function VersionDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen this version before and if enough time has passed
    const lastSeenKey = `lastSeenVersion_1`;
    const lastSeen = localStorage.getItem(lastSeenKey);

    const now = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    // Show dialog if:
    // 1. User has never seen this version, OR
    // 2. It's been more than 2 days since last seen
    const shouldShow = !lastSeen || now - parseInt(lastSeen) > twoDaysInMs;

    if (shouldShow) {
      // Show dialog after a short delay for better UX
      setTimeout(() => {
        setIsOpen(true);
      }, 2000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark this version as seen with current timestamp
    localStorage.setItem(`lastSeenVersion_1`, Date.now().toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[90%] sm:max-w-md liquid-glass-light fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 rounded-lg sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Welcome to Peter&apos;s Shop!
          </h2>
          <div className="text-center space-y-3 sm:space-y-4 flex flex-col w-full">
            <p className="text-sm sm:text-base text-gray-300">
              Our website is hosted in the East US. If you&apos;re visiting from
              another country, the speed might be a little bit slow.
            </p>
            {/* Collaboration Section */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-black/30 to-black/10 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  🤝 Want to Collaborate?
                </h3>
              </div>

              <div className="space-y-3">
                {/* Email */}
                <a
                  href="mailto:leeli.petertam@gmail.com"
                  className="flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:text-blue-200 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-blue-300 group-hover:text-blue-200 font-medium text-center truncate">
                    leeli.petertam@gmail.com
                  </span>
                </a>
                <p className="text-xs sm:text-sm text-gray-300 text-center">
                  More exciting projects coming soon! 🚀
                </p>

                {/* Social Links */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="https://www.linkedin.com/in/leeli-peter/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 group-hover:text-blue-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-blue-300 group-hover:text-blue-200 font-medium">
                      LinkedIn
                    </span>
                  </a>
                  <a
                    href="https://myprofile-eosin.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 group-hover:text-purple-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-purple-300 group-hover:text-purple-200 font-medium">
                      Portfolio
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <Button
              variant="glass"
              onClick={handleClose}
              className="mt-4 w-full sm:w-auto"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
