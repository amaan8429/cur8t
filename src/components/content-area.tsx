import { AddBukmarkPage } from "./add-bukmark";

interface ContentAreaProps {
  activeItem: string;
  activeFavorite?: string;
  activeSecondary?: string;
}

export function ContentArea({
  activeItem,
  activeFavorite,
  activeSecondary,
}: ContentAreaProps) {
  return (
    <div className="p-6">
      {activeItem === "Home" && (
        <div>
          <p className="mb-4">
            Welcome to your dashboard! Here&apos;s a quick overview:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You have 5 tasks due today</li>
            <li>3 new messages in your inbox</li>
            <li>Your team meeting is scheduled for 2:00 PM</li>
          </ul>
        </div>
      )}
      {activeItem === "Add Bukmarks" && <AddBukmarkPage />}

      {activeItem === "Ask AI" && (
        <div>
          <p>How can I assist you today? Ask me anything!</p>
        </div>
      )}
      {activeItem === "Inbox" && (
        <div>
          <p>You have 10 unread messages. Here are the latest:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Project update from Sarah</li>
            <li>New task assigned by John</li>
            <li>Team lunch reminder</li>
          </ul>
        </div>
      )}
      {activeFavorite && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Favorite: {activeFavorite}
          </h3>
          <p>This is the content for your favorite item: {activeFavorite}</p>
        </div>
      )}
      {activeSecondary && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Secondary: {activeSecondary}
          </h3>
          <p>This is the content for your secondary item: {activeSecondary}</p>
        </div>
      )}
    </div>
  );
}
