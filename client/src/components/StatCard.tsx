import { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="glass rounded-lg p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded bg-white/10 text-cinema-teal">
        <Icon size={22} />
      </div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
