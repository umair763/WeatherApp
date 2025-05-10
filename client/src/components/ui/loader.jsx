import { cn } from "../../lib/utils";

export function Loader({ size = "md", className }) {
	const sizeClasses = {
		sm: "h-4 w-4 border-2",
		md: "h-6 w-6 border-2",
		lg: "h-10 w-10 border-3",
		xl: "h-16 w-16 border-4",
	};

	return (
		<div className={cn("animate-spin rounded-full border-t-transparent border-blue-500", sizeClasses[size], className)} />
	);
}
