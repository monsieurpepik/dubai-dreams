import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Users, Shield, Bell } from 'lucide-react';
import { DeveloperLayout } from '@/components/developer/DeveloperLayout';
import { useDeveloper } from '@/contexts/DeveloperContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function DeveloperSettings() {
  const { developer, merchantUser, user, canManageTeam } = useDeveloper();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  };

  return (
    <DeveloperLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-2xl space-y-6">
        {/* Company Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Company Profile</CardTitle>
                  <CardDescription>Your developer organization details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  value={developer?.name || ''} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {developer?.subscription_tier || 'Free'}
                  </Badge>
                  <Button variant="link" size="sm" className="text-primary">
                    Upgrade Plan
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Contact us to update your company profile or logo.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Your personal account settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <Badge>
                    {merchantUser?.role ? roleLabels[merchantUser.role] : 'Member'}
                  </Badge>
                  {merchantUser?.role === 'admin' && (
                    <span className="text-xs text-muted-foreground">
                      Full access to all features
                    </span>
                  )}
                </div>
              </div>
              <Separator />
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your properties via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Lead Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified immediately when a new lead comes in
                  </p>
                </div>
                <Switch
                  checked={leadAlerts}
                  onCheckedChange={setLeadAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team (Admin only) */}
        {canManageTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Invite and manage team members</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <h3 className="mt-3 font-medium">Invite Team Members</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add colleagues to help manage your properties and leads
                  </p>
                  <Button className="mt-4" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DeveloperLayout>
  );
}
