import { Link2 } from "lucide-react";
import React from "react";

const Nolinks = () => {
  return (
    <div className="text-center p-8">
      <Link2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No links found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Add your first link to get started
      </p>
    </div>
  );
};

export default Nolinks;
