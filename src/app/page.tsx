import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <MessageSquare className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome to CandidConnect</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a room or a direct message from the sidebar to start chatting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
