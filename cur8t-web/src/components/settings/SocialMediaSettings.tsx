import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  PiTwitterLogo,
  PiLinkedinLogo,
  PiGithubLogo,
  PiPentagram,
  PiGlobe,
  PiUser,
  PiArrowSquareOut,
  PiCheck,
  PiX,
  PiCircle,
  PiEye,
  PiEyeClosed,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';

interface SocialMediaData {
  twitterUsername: string;
  linkedinUsername: string;
  githubUsername: string;
  instagramUsername: string;
  personalWebsite: string;
  bio: string;
  showSocialLinks: boolean;
}

interface SocialPlatform {
  key: keyof SocialMediaData;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  baseUrl: string;
  prefix?: string;
  validation?: (value: string) => boolean;
  description?: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    key: 'twitterUsername',
    label: 'Twitter/X',
    icon: PiTwitterLogo,
    placeholder: 'username',
    baseUrl: 'https://twitter.com/',
    prefix: '@',
    validation: (value) => /^[a-zA-Z0-9_]{1,15}$/.test(value),
    description: 'Your Twitter/X handle (without @)',
  },
  {
    key: 'githubUsername',
    label: 'GitHub',
    icon: PiGithubLogo,
    placeholder: 'username',
    baseUrl: 'https://github.com/',
    validation: (value) =>
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value),
    description: 'Your GitHub username',
  },
  {
    key: 'linkedinUsername',
    label: 'LinkedIn',
    icon: PiLinkedinLogo,
    placeholder: 'username',
    baseUrl: 'https://linkedin.com/in/',
    validation: (value) => /^[a-zA-Z0-9-]{3,100}$/.test(value),
    description: 'Your LinkedIn username (from your profile URL)',
  },
  {
    key: 'instagramUsername',
    label: 'Instagram',
    icon: PiPentagram,
    placeholder: 'username',
    baseUrl: 'https://instagram.com/',
    prefix: '@',
    validation: (value) => /^[a-zA-Z0-9._]{1,30}$/.test(value),
    description: 'Your Instagram username (without @)',
  },
];

export default function SocialMediaSettings() {
  const [formData, setFormData] = useState<SocialMediaData>({
    twitterUsername: '',
    linkedinUsername: '',
    githubUsername: '',
    instagramUsername: '',
    personalWebsite: '',
    bio: '',
    showSocialLinks: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocialMediaSettings = async () => {
      try {
        const response = await fetch('/api/settings/socialmedia');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            twitterUsername: data.twitterUsername ?? '',
            linkedinUsername: data.linkedinUsername ?? '',
            githubUsername: data.githubUsername ?? '',
            instagramUsername: data.instagramUsername ?? '',
            personalWebsite: data.personalWebsite ?? '',
            bio: data.bio ?? '',
            showSocialLinks:
              typeof data.showSocialLinks === 'boolean'
                ? data.showSocialLinks
                : true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load social media settings',
          className: 'bg-primary border-primary text-primary-foreground',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialMediaSettings();
  }, [toast]);

  const validateField = (key: string, value: string): string => {
    if (!value.trim()) return '';

    const platform = socialPlatforms.find((p) => p.key === key);
    if (platform?.validation && !platform.validation(value)) {
      return `Invalid ${platform.label} username format`;
    }

    if (key === 'personalWebsite' && value) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        return 'Please enter a valid website URL';
      }
    }

    return '';
  };

  const handleInputChange = (key: keyof SocialMediaData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);

    const error = validateField(key, value);
    setValidationErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleToggleChange = (key: keyof SocialMediaData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: checked }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/socialmedia', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check for rate limiting first
      if (response.status === 429) {
        const data = await response.json();
        const retryAfter =
          response.headers.get('retry-after') || data.retryAfter || 60;

        const { showRateLimitToast } = await import(
          '@/components/ui/rate-limit-toast'
        );
        showRateLimitToast({
          retryAfter:
            typeof retryAfter === 'string'
              ? parseInt(retryAfter) * 60
              : retryAfter * 60,
          message:
            'Too many social media update attempts. Please try again later.',
        });
        return;
      }

      if (response.ok) {
        setHasChanges(false);
        toast({
          title: 'Success',
          description: 'Your social media settings have been updated',
          className: 'bg-primary border-primary text-primary-foreground',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update social media settings',
        className: 'bg-primary border-primary text-primary-foreground',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getProfileUrl = (platform: SocialPlatform, username: string) => {
    if (!username) return '';
    return platform.baseUrl + username;
  };

  const renderSocialInput = (platform: SocialPlatform) => {
    const Icon = platform.icon;
    const value = formData[platform.key] as string;
    const error = validationErrors[platform.key];
    const isValid = value && !error;

    return (
      <div key={platform.key} className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={platform.key} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {platform.label}
          </Label>
          {isValid && (
            <a
              href={getProfileUrl(platform, value)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <PiArrowSquareOut className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="relative">
          <div className="flex">
            {platform.prefix && (
              <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
                {platform.prefix}
              </span>
            )}
            <Input
              id={platform.key}
              placeholder={platform.placeholder}
              value={value}
              onChange={(e) => handleInputChange(platform.key, e.target.value)}
              className={cn(
                platform.prefix ? 'rounded-l-none' : '',
                error ? 'border-destructive focus:border-destructive' : '',
                isValid ? 'border-green-500 focus:border-green-500' : ''
              )}
            />
            {value && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {error ? (
                  <PiX className="h-4 w-4 text-destructive" />
                ) : (
                  <PiCheck className="h-4 w-4 text-green-600" />
                )}
              </div>
            )}
          </div>
        </div>

        {platform.description && (
          <p className="text-sm text-muted-foreground">
            {platform.description}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <PiCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {isValid && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Preview: {platform.baseUrl}
              {value}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PiUser className="h-5 w-5 text-primary" />
            Social Media Settings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            {previewMode ? (
              <PiEyeClosed className="h-4 w-4" />
            ) : (
              <PiEye className="h-4 w-4" />
            )}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {previewMode ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Preview</h3>
            {formData.bio && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Bio</h4>
                <p className="text-muted-foreground">{formData.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {socialPlatforms.map((platform) => {
                const value = formData[platform.key] as string;
                if (!value) return null;

                const Icon = platform.icon;
                return (
                  <a
                    key={platform.key}
                    href={getProfileUrl(platform, value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{platform.label}</p>
                      <p className="text-sm text-gray-600">
                        {platform.prefix}
                        {value}
                      </p>
                    </div>
                    <PiArrowSquareOut className="h-4 w-4 ml-auto" />
                  </a>
                );
              })}

              {formData.personalWebsite && (
                <a
                  href={
                    formData.personalWebsite.startsWith('http')
                      ? formData.personalWebsite
                      : `https://${formData.personalWebsite}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PiGlobe className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Personal Website</p>
                    <p className="text-sm text-gray-600">
                      {formData.personalWebsite}
                    </p>
                  </div>
                  <PiArrowSquareOut className="h-4 w-4 ml-auto" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <PiUser className="h-4 w-4" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-600">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="personalWebsite"
                  className="flex items-center gap-2"
                >
                  <PiGlobe className="h-4 w-4" />
                  Personal Website
                </Label>
                <Input
                  id="personalWebsite"
                  placeholder="https://yourwebsite.com"
                  value={formData.personalWebsite}
                  onChange={(e) =>
                    handleInputChange('personalWebsite', e.target.value)
                  }
                  className={cn(
                    validationErrors.personalWebsite ? 'border-red-500' : '',
                    formData.personalWebsite &&
                      !validationErrors.personalWebsite
                      ? 'border-green-500'
                      : ''
                  )}
                />
                {validationErrors.personalWebsite && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <PiCircle className="h-3 w-3" />
                    {validationErrors.personalWebsite}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Social Media Accounts</h3>
              {socialPlatforms.map(renderSocialInput)}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="showSocialLinks"
                  className="text-base font-medium"
                >
                  Show Social Links
                </Label>
                <p className="text-sm text-gray-600">
                  Display your social media links on your public profile
                </p>
              </div>
              <Switch
                id="showSocialLinks"
                checked={formData.showSocialLinks}
                onCheckedChange={(checked) =>
                  handleToggleChange('showSocialLinks', checked)
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={
              !hasChanges ||
              isSaving ||
              Object.values(validationErrors).some((error) => error)
            }
            className="min-w-[100px] bg-primary hover:bg-primary/90"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
