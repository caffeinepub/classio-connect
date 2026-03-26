import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-white">Classio</div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.72 0.12 220)", marginTop: "-2px" }}
                >
                  Connect
                </div>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-xs">
              Master English at any age with Lexi, your personal AI tutor.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { label: "Courses", to: "/courses" },
              { label: "AI Tutor", to: "/ai-tutor" },
              { label: "Community", to: "/" },
              { label: "FAQ", to: "/" },
              { label: "Blog", to: "/" },
              { label: "Contact", to: "/" },
              { label: "Terms", to: "/" },
              { label: "Privacy", to: "/" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { icon: SiX, href: "#", label: "X" },
              { icon: SiFacebook, href: "#", label: "Facebook" },
              { icon: SiInstagram, href: "#", label: "Instagram" },
              { icon: SiYoutube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/40">
          <span>© {year} Classio Connect. All rights reserved.</span>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
