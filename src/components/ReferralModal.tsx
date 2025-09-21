import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  postedBy: string;
}

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export const ReferralModal = ({ isOpen, onClose, job }: ReferralModalProps) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendReferral = async () => {
    if (!message.trim() || !subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Referral Request Sent!",
        description: `Your referral request for ${job?.title} has been sent to ${job?.postedBy}.`,
      });
      
      setMessage("");
      setSubject("");
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const defaultSubject = job ? `Referral Request for ${job.title} at ${job.company}` : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2 text-primary" />
            Request Referral
          </DialogTitle>
          <DialogDescription>
            Send a personalized message to request a referral for this position.
          </DialogDescription>
        </DialogHeader>

        {job && (
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback className="gradient-primary text-white">
                    {job.postedBy.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <Building className="h-4 w-4 mr-1" />
                    <span className="mr-4">{job.company}</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>Referral Contact: <strong>{job.postedBy}</strong></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject line..."
              value={subject || defaultSubject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Hi [Name],

I hope this message finds you well. I'm a student at [University] studying [Field], and I'm very interested in the [Position] role at [Company].

I believe my skills in [relevant skills] align well with this position, and I would be grateful for any guidance or referral you could provide.

I've attached my resume for your review. Thank you for your time and consideration.

Best regards,
[Your Name]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendReferral} 
            disabled={isLoading}
            className="gradient-primary text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Referral Request
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};