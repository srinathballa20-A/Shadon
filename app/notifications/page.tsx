import { Navbar } from "@/components/navbar"
import { NotificationsContent } from "@/components/notifications-content"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <NotificationsContent />
      </main>
    </div>
  )
}
