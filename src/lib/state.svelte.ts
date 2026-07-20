export const sharedState = $state({
    clicked: false,
    summary: null as any,
    similarity: null as any,
});

export function handleClick() {
    sharedState.clicked = !sharedState.clicked;
}

export function handleShowSummary(results: any) {
    sharedState.summary = results;
}

export function handleShowSimilarity(results: any) {
    sharedState.similarity = results;
}