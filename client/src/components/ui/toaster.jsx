"use client";

import { useToast } from "../../hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

export function Toaster() {
	const { toasts, dismiss } = useToast();

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					toast={toast}
					onDismiss={() => dismiss(toast.id)}
				/>
			))}
		</div>
	);
}

function Toast({ toast, onDismiss }) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger entrance animation
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 10);

		return () => clearTimeout(timer);
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		setTimeout(onDismiss, 300); // Wait for exit animation
	};

	const variantStyles = {
		default: "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100",
		destructive: "bg-red-500 text-white",
		success: "bg-green-500 text-white",
	};

	return (
		<div
			className={cn(
				"rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out",
				variantStyles[toast.variant] || variantStyles.default,
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
			)}>
			<div className="flex justify-between items-start">
				<div>
					{toast.title && <h3 className="font-medium">{toast.title}</h3>}
					{toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
				</div>
				<button
					onClick={handleDismiss}
					className="ml-4 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
