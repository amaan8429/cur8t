import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  PiHeart,
  PiLink,
  PiCopy,
  PiCheck,
  PiShare,
  PiBook,
  PiTwitterLogo,
  PiFacebookLogo,
  PiLinkedinLogo,
} from 'react-icons/pi';
import {
  getSocialIcon,
  getSocialUrl,
  buildSocialLinks,
  type SocialLink,
} from '@/utils/socialLinks';
import { type User, type Collection } from '@/types/profile';

interface ProfileSidebarProps {
  user: User;
  collections: Collection[];
}

export function ProfileSidebar({ user, collections }: ProfileSidebarProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const socialLinks = buildSocialLinks(user);

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: 'Profile link copied!',
        description: 'Share this link to let others view this profile.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy link',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    const text = `Check out ${user?.name}'s bookmark collections on Cur8t!`;

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const totalLikes = collections.reduce(
    (total, collection) => total + collection.likes,
    0
  );
  const totalLinks = collections.reduce(
    (total, collection) => total + collection.totalLinks,
    0
  );

  return (
    <div className="w-72 flex-shrink-0">
      <div className="sticky top-8">
        {/* Avatar and Name */}
        <div className="mb-6">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarFallback className="text-lg bg-muted text-muted-foreground font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-1 text-foreground">
            {user.name}
          </h1>

          <p className="text-lg text-muted-foreground mb-3">{user.username}</p>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-foreground mb-4 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {socialLinks.map((link, index) => {
                const IconComponent = getSocialIcon(link.platform);
                return (
                  <a
                    key={index}
                    href={getSocialUrl(link.platform, link.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    aria-label={`${link.platform} profile`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Share Profile Buttons */}
          <div className="space-y-2 mb-6">
            <Button
              variant="outline"
              onClick={handleShareProfile}
              disabled={copied}
              className="w-full justify-start gap-2 h-8 text-sm"
            >
              {copied ? (
                <PiCheck className="h-3.5 w-3.5" />
              ) : (
                <PiCopy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy Profile Link'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-8 text-sm"
                >
                  <PiShare className="h-3.5 w-3.5" />
                  Share Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
                  <PiTwitterLogo className="h-4 w-4 mr-2" />
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
                  <PiFacebookLogo className="h-4 w-4 mr-2" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
                  <PiLinkedinLogo className="h-4 w-4 mr-2" />
                  LinkedIn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <PiBook className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{collections.length}</strong> public repositories
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PiHeart className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{totalLikes}</strong> total likes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PiLink className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{totalLinks}</strong> total links
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
