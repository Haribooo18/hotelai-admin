import { MessageSquare } from "lucide-react";

export function EmptyConversation() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900">
        <MessageSquare className="h-8 w-8 text-zinc-600" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-300">
          Выберите диалог
        </h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Выберите беседу из списка слева, чтобы просмотреть сообщения и
          управлять обращением гостя.
        </p>
      </div>
    </div>
  );
}
