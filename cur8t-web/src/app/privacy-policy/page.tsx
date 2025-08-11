import React from 'react';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PiArrowLeft, PiEnvelope, PiGlobe, PiMapPin } from 'react-icons/pi';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Cur8t',
  description:
    'Learn how Cur8t protects your privacy and handles your data when using our services.',
  keywords: ['privacy', 'data protection', 'cur8t', 'bookmarks', 'security'],
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <PiArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mt-2">
                How we protect your privacy and handle your data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Last Updated */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Last Updated</CardTitle>
                <Badge variant="secondary">2025-08-11</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This Privacy Policy explains how Cur8t (&quot;we,&quot;
                &quot;our,&quot; or &quot;us&quot;) collects, uses, and
                safeguards your information when you use our services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>API Keys:</strong> When you connect your account,
                      you provide an API key to authenticate with our services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Bookmark Data:</strong> URLs, titles, and metadata
                      of bookmarks you save through our services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Collection Information:</strong> Names,
                      descriptions, and visibility settings for your bookmark
                      collections
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Account Preferences:</strong> Settings and
                      preferences you configure within our services
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Automatically Collected Information
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Usage Analytics:</strong> Basic usage statistics
                      to improve our services (e.g., features used, error
                      reports)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Technical Data:</strong> Browser type, service
                      version, and performance metrics
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Storage Data:</strong> Local storage of your
                      bookmarks, collections, and preferences
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Information We Do Not Collect
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Personal Identifiable Information:</strong> We do
                      not collect names, email addresses, or other personal
                      details
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Browsing History:</strong> We do not track your
                      general browsing history outside of bookmarks you
                      explicitly save
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Content of Web Pages:</strong> We do not access or
                      store the content of web pages you visit
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Primary Purposes
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Functionality:</strong> To provide
                      bookmark organization and collection features
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Account Management:</strong> To authenticate your
                      API key and manage your account
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Data Synchronization:</strong> To sync your
                      bookmarks and collections across devices
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Improvement:</strong> To analyze usage
                      patterns and improve service performance
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Secondary Purposes
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Error Monitoring:</strong> To identify and fix
                      technical issues
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Feature Development:</strong> To understand how
                      features are used and develop new capabilities
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Security:</strong> To detect and prevent abuse or
                      security threats
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage and Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Data Storage and Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Local Storage
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Browser Storage:</strong> Your bookmarks and
                      collections are stored locally in your browser
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Offline Access:</strong> Data is cached locally to
                      enable offline functionality
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Data Control:</strong> You have full control over
                      locally stored data
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Cloud Storage
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Secure Servers:</strong> Your data is stored on
                      secure servers with encryption in transit and at rest
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Access Control:</strong> Only you can access your
                      data through your API key
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Backup:</strong> Regular backups are performed to
                      ensure data availability
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Security Measures
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>HTTPS Encryption:</strong> All data transmission
                      uses industry-standard HTTPS encryption
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>API Key Security:</strong> API keys are stored
                      securely and never shared
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Access Logging:</strong> We log access to our
                      services for security monitoring
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing and Disclosure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Data Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  We Do Not Share Your Data With
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Third Parties:</strong> We do not sell, rent, or
                      share your data with third parties
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Advertisers:</strong> We do not use your data for
                      advertising purposes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Other Users:</strong> Your private collections
                      remain private unless you choose to make them public
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Limited Exceptions
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Legal Requirements:</strong> We may disclose data
                      if required by law or to protect our rights
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Providers:</strong> We may use trusted
                      service providers for hosting and technical support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Aggregated Data:</strong> We may share anonymized,
                      aggregated usage statistics (no individual data)
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights and Choices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Access and Control
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>View Your Data:</strong> Access all your bookmarks
                      and collections through our services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Export Data:</strong> Export your data in multiple
                      formats (HTML, JSON, TXT)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Delete Data:</strong> Remove individual bookmarks,
                      collections, or your entire account
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Privacy Settings
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Collection Visibility:</strong> Choose public or
                      private visibility for your collections
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Data Retention:</strong> Control how long your
                      data is stored
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Analytics Opt-out:</strong> Choose whether to
                      share usage analytics
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Account Management
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>API Key Management:</strong> Generate new API keys
                      or revoke existing ones
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Account Deletion:</strong> Request complete
                      deletion of your account and data
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Active Accounts
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Bookmarks:</strong> Stored indefinitely while your
                      account is active
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Collections:</strong> Maintained until you delete
                      them
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Usage Data:</strong> Retained for up to 2 years
                      for service improvement
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Deleted Accounts
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Immediate Deletion:</strong> All data is deleted
                      within 30 days of account deletion
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Backup Removal:</strong> Backups are purged within
                      90 days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>No Recovery:</strong> Deleted data cannot be
                      recovered
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Additional Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Children&apos;s Privacy
                </h3>
                <p className="text-muted-foreground">
                  Our services are not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you are a parent or guardian and believe
                  your child has provided us with personal information, please
                  contact us.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  International Data Transfers
                </h3>
                <p className="text-muted-foreground">
                  Your data may be processed and stored in countries other than
                  your own. We ensure appropriate safeguards are in place to
                  protect your data in accordance with this Privacy Policy.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Changes to This Privacy Policy
                </h3>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  our website, updating the &quot;Last Updated&quot; date, and
                  sending a notification through our services for significant
                  changes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PiEnvelope className="h-5 w-5 text-primary" />
                  <span className="text-foreground">support@cur8t.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <PiGlobe className="h-5 w-5 text-primary" />
                  <span className="text-foreground">https://cur8t.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <PiMapPin className="h-5 w-5 text-primary" />
                  <span className="text-foreground">
                    123 Main St, Anytown, USA
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Legal Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  California Privacy Rights
                </h3>
                <p className="text-muted-foreground">
                  If you are a California resident, you have additional rights
                  under the California Consumer Privacy Act (CCPA). Please
                  contact us for more information about these rights.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  European Privacy Rights
                </h3>
                <p className="text-muted-foreground">
                  If you are in the European Economic Area (EEA), you have
                  additional rights under the General Data Protection Regulation
                  (GDPR). Please contact us for more information about these
                  rights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
