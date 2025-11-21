<link rel="stylesheet" href="/shared.css" />

<script>
	let { data } = $props();
</script>

<h1>crosswords for emma</h1>

<ul>
	{#each data.summaries as { slug, title }}
		<li><a href="/crossword/{slug}">{title}</a></li>
	{/each}
</ul>