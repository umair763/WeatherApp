import * as React from "react";
import { cn } from "../../lib/utils";

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("w-full h-full", className)}
		{...props}
	/>
));
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("border bg-background px-3 py-2 shadow-sm rounded-lg", className)}
		{...props}
	/>
));
ChartTooltip.displayName = "ChartTooltip";

const ChartTooltipContent = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col gap-1", className)}
		{...props}
	/>
));
ChartTooltipContent.displayName = "ChartTooltipContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent };
