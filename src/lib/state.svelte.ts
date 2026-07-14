export const sharedState = $state({
    clicked: false,
    summary: null as any,
});

export function handleClick() {
    sharedState.clicked = !sharedState.clicked;
}

export function handleShowSummary(results: any) {
    sharedState.summary = results;
}