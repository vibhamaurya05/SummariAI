function parsePoint(point: string) {
  const isNumber = /^\d+\. /.test(point);
  const isBullet = /^\* /.test(point);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
  const hasemoji = emojiRegex.test(point);
  const isEmpty = !point.trim();
  return { isNumber, isBullet, hasemoji, isEmpty };
}

function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(/^[.*]\s*/, "").trim();
  const matches = cleanContent.match(/^(\p{Emoji}+)(.*)/u);
  if (matches) {
    const [, emoji, text] = matches;
    return { emoji: emoji.trim(), text: text.trim() };
  }
  return { emoji: "", text: cleanContent };
}

export default function ContentSection({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div className="space-y-4">
      {points.map((point, index) => {
        const { isBullet, hasemoji, isEmpty } = parsePoint(point);
        const { emoji, text } = parseEmojiPoint(point);

        if (isEmpty) return null;

        return (
          <div
            key={`point-${index}`}
            className="group relative bg-gradient-to-br from-gray-100/60 to-white dark:from-zinc-800/40 dark:to-zinc-900 p-4 rounded-2xl border border-blue-200 dark:border-zinc-700 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            <div className="relative flex items-start gap-3">
              {(hasemoji || isBullet) && (
                <span className="text-xl shrink-0 pt-1">{emoji || "•"}</span>
              )}
              <p className="text-sm sm:text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                {text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
