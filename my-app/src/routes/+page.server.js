import { puzzles } from './data.js';

export function load() {
	return {
		summaries: puzzles.map((puzzle) => ({
			slug: puzzle.slug,
			title: puzzle.title
		}))
	};
}