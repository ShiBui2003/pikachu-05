import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, AlertTriangle, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Civic Issue Reporting Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Report civic issues in your community and track their resolution. Together, we can make our city better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/citizen/login">Citizen Portal</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/admin/login">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                <CardTitle>Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily report potholes, broken streetlights, garbage, and other civic issues with photos and location
                  data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-status-review mx-auto mb-4" />
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor the status of your reported issues from submission to resolution with real-time updates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-status-progress mx-auto mb-4" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join a community of engaged citizens working together to improve local infrastructure and services.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-status-resolved mx-auto mb-4" />
                <CardTitle>Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See real impact as municipal authorities address and resolve issues reported by the community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">1,247</div>
              <div className="text-muted-foreground">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-status-resolved mb-2">892</div>
              <div className="text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-status-progress mb-2">355</div>
              <div className="text-muted-foreground">Active Citizens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
