<div class="container mx-auto px-8 py-3 w-full text-white">
	<h1 class="text-4xl font-bold mb-4">
		About <span class="font-bold graffiti-text">Graffiti</span><span class="font-light logo-text"
			>Air</span
		>
	</h1>

	<p class="mb-8">
		Welcome to <span class="font-bold graffiti-text">Graffiti</span><span
			class="font-light logo-text">Air</span
		>, where the virtual skies come alive with color!
		<span class="font-bold graffiti-text">Graffiti</span><span class="font-light logo-text"
			>Air</span
		> is an innovative project that transforms the airspace over the United States into a canvas of vibrant
		hues, all driven by the real-time movements of virtual aircraft on VATSIM.
	</p>

	<h2 class="text-2xl font-bold mb-4">Tracking the Sky's Palette</h2>

	<p class="mb-4">
		Nine Virtual Air Route Traffic Control Centers (vARTCCs) have been entrusted with the power of
		color. Each center, represented by distinct geographical regions, has been given units of three
		primary colors: green, red, and blue. These colors spread as flights traverse the airspace,
		creating a dynamic tapestry that reflects the virtual aviation activity across the country.
	</p>

	<h3 class="text-xl font-bold mb-2">The Color Assignment</h3>
	<ul class="list-disc pl-8 mb-4">
		<li>For ZLA, ZOA, ZSE: 5 Green Units</li>
		<li>For ZME, ZFW, ZHU: 5 Red Units</li>
		<li>For ZBW, ZNY, ZDC: 5 Blue Units</li>
	</ul>

	<h3 class="text-xl font-bold mb-2">Flight Strip Showcase</h3>
	<p class="mb-4">
		At the bottom of the page, explore the Flight Strip section showcasing the recent bursts of
		color. Note that each spread is calculated upon landing, adding an element of surprise to the
		color palette.
	</p>

	<h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

	<h3 class="text-xl font-bold mb-2">Why was my flight not tracked?</h3>
	<p class="mb-4">
		Flights are discovered using the VATSIM Data API. Ensure you have filed a flight plan for your
		journey. If you've filed a plan and still don't see your flight, there may be issues fetching
		data from the API.
	</p>

	<h3 class="text-xl font-bold mb-2">How do you know if a flight has arrived?</h3>
	<p class="mb-4">
		The VATSIM data API provides latitude, longitude, and altitude. We compare these against your
		destination. When you're close enough, your flight is marked as "arrived."
	</p>

	<h3 class="text-xl font-bold mb-2">How often can I log flights?</h3>
	<p class="mb-4">
		Flights are tracked by CID, Callsign, Departure, and Arrival Airports. Fly as many different
		routes as you wish, but a 3-hour interval is imposed for identical flights.
	</p>

	<h3 class="text-xl font-bold mb-2">What's the point?</h3>
	<p class="mb-4">
		<span class="font-bold graffiti-text">Graffiti</span><span class="font-light logo-text"
			>Air</span
		> currently serves as a mesmerizing visualization of virtual flights on VATSIM across the United
		States. Stay tuned as we explore the potential of turning this into an interactive and engaging game
		in the future.
	</p>

	<p class="mb-4">
		Join us as we turn the virtual sky into an ever-changing masterpiece. Explore, fly, and be part
		of the living canvas that is <span class="font-bold graffiti-text">Graffiti</span><span
			class="font-light logo-text">Air</span
		>!
	</p>
</div>

<style>
	.graffiti-text {
		background: linear-gradient(
			90deg,
			rgb(48, 181, 64) 10%,
			rgb(214, 0, 14) 30%,
			rgb(133, 2, 221) 70%,
			rgb(48, 199, 255) 80%
		);
		-webkit-background-clip: text;
		color: transparent;
	}
</style>
