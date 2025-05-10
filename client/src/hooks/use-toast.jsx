"use client";

import { useState, useCallback } from "react";

export function useToast() {
	const [toasts, setToasts] = useState([]);

	const toast = useCallback(({ title, description, variant = "default", duration = 5000 }) => {
		const id = Date.now();

		setToasts((prev) => [
			...prev,
			{
				id,
				title,
				description,
				variant,
			},
		]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, duration);

		return id;
	}, []);

	const dismiss = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return {
		toast,
		dismiss,
		toasts,
	};
}
