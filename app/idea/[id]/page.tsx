import { Navbar } from "@/components/navbar"
import { IdeaDetailContent } from "@/components/idea-detail-content"

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <IdeaDetailContent ideaId={id} />
      </main>
    </div>
  )
}
