import { verifyAdmin } from "@/features/admin/queries"
import { getFeedbackList } from "@/features/feedback/queries"
import AdminCards from "@/features/admin/components/AdminCards"

export default async function AdminPage() {
    await verifyAdmin()
    const allFeedback = await getFeedbackList()

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Panel Logistyczny</h1>
                <p className="text-zinc-500 mt-2">Zarządzaj nadesłanymi zgłoszeniami społeczności i zmieniaj etapy ich realizacji.</p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                {allFeedback.map((fb) => (
                    <AdminCards key={fb.id} feedback={fb} />
                ))}
            </div>
        </main>
    )
}
