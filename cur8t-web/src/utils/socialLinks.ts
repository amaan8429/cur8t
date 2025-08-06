import {
  PiTwitterLogo,
  PiLinkedinLogo,
  PiGithubLogo,
  PiPentagram,
  PiGlobe,
  PiArrowSquareOut,
} from "react-icons/pi";

export interface SocialLink {
  platform: string;
  username: string;
}

export interface User {
  twitterUsername?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  instagramUsername?: string;
  personalWebsite?: string;
  showSocialLinks?: boolean;
}

export const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "twitter":
      return PiTwitterLogo;
    case "linkedin":
      return PiLinkedinLogo;
    case "github":
      return PiGithubLogo;
    case "instagram":
      return PiPentagram;
    case "website":
      return PiGlobe;
    default:
      return PiArrowSquareOut;
  }
};

export const getSocialUrl = (platform: string, username: string) => {
  switch (platform) {
    case "twitter":
      return `https://twitter.com/${username}`;
    case "linkedin":
      return `https://linkedin.com/in/${username}`;
    case "github":
      return `https://github.com/${username}`;
    case "instagram":
      return `https://instagram.com/${username}`;
    case "website":
      return username.startsWith("http") ? username : `https://${username}`;
    default:
      return username;
  }
};

export const buildSocialLinks = (user: User): SocialLink[] => {
  const socialLinks: SocialLink[] = [];

  if (!user.showSocialLinks) return socialLinks;

  if (user.twitterUsername)
    socialLinks.push({ platform: "twitter", username: user.twitterUsername });
  if (user.linkedinUsername)
    socialLinks.push({ platform: "linkedin", username: user.linkedinUsername });
  if (user.githubUsername)
    socialLinks.push({ platform: "github", username: user.githubUsername });
  if (user.instagramUsername)
    socialLinks.push({
      platform: "instagram",
      username: user.instagramUsername,
    });
  if (user.personalWebsite)
    socialLinks.push({ platform: "website", username: user.personalWebsite });

  return socialLinks;
};
