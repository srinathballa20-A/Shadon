import { Navbar } from "@/components/navbar"
import { PostIdeaForm } from "@/components/post-idea-form"

export default function PostIdeaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <PostIdeaForm />
      </main>
    </div>
  )
}
