
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Clock, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-embassy-primary mb-8">Welcome, User</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Submit your visa documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Track your submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-orange-500">
                <Clock className="mr-2 h-4 w-4" />
                Processing
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verified Documents</CardTitle>
              <CardDescription>Completed applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-green-500">
                <CheckCircle className="mr-2 h-4 w-4" />
                2 Completed
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
